import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import admin from './firebaseInit.js';
import { FieldValue } from 'firebase-admin/firestore';

import { runWithSessionLock } from './sessionMemory.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @typedef {{ schemaVersion: number, basicInfoLines: string[], lastEmotionalNote: string, careOpener: string, lastReflectAt?: string }} LongTermMemoryState */

const DOC_ID = 'default';
const MAX_BASIC_INFO_CHARS = Number(process.env.LTM_MAX_BASIC_CHARS ?? 2000);
const MAX_EMOTIONAL_CHARS = Number(process.env.LTM_MAX_EMOTIONAL_CHARS ?? 600);
const MAX_CARE_OPENER_CHARS = 120;
const FIRESTORE_OP_TIMEOUT_MS = Number(process.env.FIRESTORE_OP_TIMEOUT_MS ?? 8000);

const ltmMem = new Map();

let firestoreReadWarned = false;
/** 单次进程内：Firestore 一旦超时/失败即熔断，后续只走内存，避免每条消息反复等满超时时间 */
let firestoreCircuitOpen = false;

/**
 * Firestore 在部分网络环境下会长时间阻塞（如无法访问 Google）；超时后回退内存，避免 AI 对话整请求卡死。
 * @template T
 * @param {Promise<T>} promise
 * @param {string} label
 */
async function withFirestoreTimeout(promise, label) {
  let t;
  const timeout = new Promise((_, reject) => {
    t = setTimeout(
      () => reject(new Error(`${label} 超过 ${FIRESTORE_OP_TIMEOUT_MS}ms`)),
      FIRESTORE_OP_TIMEOUT_MS,
    );
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(t);
  }
}

let firestoreDb = null;
let firestoreInitAttempted = false;
let firestoreInitOk = false;

export function isFirestoreReflectConfigured() {
  const v = process.env.FIRESTORE_REFLECT;
  return v === '1' || v === 'true' || v === 'yes';
}

function tryInitFirestore() {
  if (firestoreInitAttempted) return firestoreDb;
  firestoreInitAttempted = true;

  if (!isFirestoreReflectConfigured()) {
    firestoreDb = null;
    return null;
  }

  try {
    if (!admin.apps.length) {
      const saPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
      if (saPath) {
        const abs = path.isAbsolute(saPath) ? saPath : path.join(__dirname, saPath);
        const raw = fs.readFileSync(abs, 'utf8');
        const json = JSON.parse(raw);
        admin.initializeApp({
          credential: admin.credential.cert(json),
        });
      } else {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
        });
      }
    }
    firestoreDb = admin.firestore();
    firestoreInitOk = true;
    console.log(
      '[server] Firestore 长期记忆已启用（文档 users/{uid}/aiLongTerm/default）',
    );
  } catch (err) {
    console.warn(
      '[server] Firestore 初始化失败，长期记忆使用进程内存：',
      err instanceof Error ? err.message : err,
    );
    firestoreDb = null;
    firestoreInitOk = false;
  }

  return firestoreDb;
}

function normalizeUid(userId) {
  if (typeof userId !== 'string' || !userId.trim()) return 'anon';
  return userId.trim();
}

function useFirestoreForUser(uid) {
  if (!uid || uid === 'anon') return false;
  if (firestoreCircuitOpen) return false;
  tryInitFirestore();
  return Boolean(firestoreInitOk && firestoreDb);
}

function tripFirestoreCircuit() {
  firestoreCircuitOpen = true;
}

function firestoreDocRef(db, uid) {
  return db.collection('users').doc(uid).collection('aiLongTerm').doc(DOC_ID);
}

function memStorageKey(uid, conversationId) {
  if (uid === 'anon') return `anon:${conversationId}`;
  return `user:${uid}`;
}

function normalizeState(d) {
  if (!d || typeof d !== 'object') return null;
  return {
    schemaVersion: typeof d.schemaVersion === 'number' ? d.schemaVersion : 2,
    basicInfoLines: Array.isArray(d.basicInfoLines) ? d.basicInfoLines.map(String) : [],
    lastEmotionalNote: typeof d.lastEmotionalNote === 'string' ? d.lastEmotionalNote : '',
    careOpener: typeof d.careOpener === 'string' ? d.careOpener : '',
    lastReflectAt: typeof d.lastReflectAt === 'string' ? d.lastReflectAt : '',
  };
}

/**
 * @param {string} userId
 * @param {string} conversationId 未登录分支下用于区分匿名会话；已登录可传任意非空
 */
export async function getLongTermMemory(userId, conversationId) {
  const uid = normalizeUid(userId);
  const cid = typeof conversationId === 'string' && conversationId.trim() ? conversationId.trim() : '';

  if (uid === 'anon') {
    if (!cid) return null;
    return normalizeState(ltmMem.get(memStorageKey('anon', cid))) ?? null;
  }

  if (useFirestoreForUser(uid)) {
    const db = tryInitFirestore();
    if (!db) return normalizeState(ltmMem.get(memStorageKey(uid, cid))) ?? null;
    try {
      const snap = await withFirestoreTimeout(
        firestoreDocRef(db, uid).get(),
        'Firestore 读取长期记忆',
      );
      if (!snap.exists) return null;
      return normalizeState(snap.data());
    } catch (err) {
      tripFirestoreCircuit();
      if (!firestoreReadWarned) {
        firestoreReadWarned = true;
        console.warn(
          '[server] Firestore 不可用或超时，已熔断：本进程内长期记忆仅用内存（重启丢失）。要彻底关闭重试请设 FIRESTORE_REFLECT=false；要云端持久化请让本机/VPN 能访问 Google。',
          err instanceof Error ? err.message : err,
        );
      }
      return normalizeState(ltmMem.get(memStorageKey(uid, cid))) ?? null;
    }
  }

  return normalizeState(ltmMem.get(memStorageKey(uid, cid))) ?? null;
}

/**
 * @param {string} userId
 * @param {string} conversationId
 * @param {LongTermMemoryState} state
 */
export async function saveLongTermMemory(userId, conversationId, state) {
  const uid = normalizeUid(userId);
  const cid = typeof conversationId === 'string' && conversationId.trim() ? conversationId.trim() : '';

  const payload = {
    ...state,
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (uid === 'anon') {
    if (!cid) return;
    ltmMem.set(memStorageKey('anon', cid), { ...state });
    return;
  }

  if (useFirestoreForUser(uid)) {
    const db = tryInitFirestore();
    if (!db) {
      ltmMem.set(memStorageKey(uid, cid), { ...state });
      return;
    }
    try {
      await withFirestoreTimeout(
        firestoreDocRef(db, uid).set(payload, { merge: false }),
        'Firestore 写入长期记忆',
      );
    } catch (err) {
      tripFirestoreCircuit();
      if (!firestoreReadWarned) {
        firestoreReadWarned = true;
        console.warn(
          '[server] Firestore 写入失败，已熔断并改用进程内存：',
          err instanceof Error ? err.message : err,
        );
      }
      ltmMem.set(memStorageKey(uid, cid), { ...state });
    }
    return;
  }

  ltmMem.set(memStorageKey(uid, cid), { ...state });
}

function clamp(s, max) {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

function trimBasicInfoLines(lines) {
  const out = [...lines];
  while (out.join('\n').length > MAX_BASIC_INFO_CHARS && out.length > 0) {
    out.shift();
  }
  if (out.join('\n').length > MAX_BASIC_INFO_CHARS && out.length) {
    out[out.length - 1] = clamp(out[out.length - 1], MAX_BASIC_INFO_CHARS);
  }
  return out;
}

/**
 * @param {LongTermMemoryState | null} previous
 * @param {{ basic_info_delta?: string[], emotional_probe?: string, care_opener?: string } | null} parsed
 * @returns {LongTermMemoryState | null}
 */
export function mergeReflectIntoMemory(previous, parsed) {
  if (!parsed) return previous;

  const prev = previous ?? {
    schemaVersion: 2,
    basicInfoLines: [],
    lastEmotionalNote: '',
    careOpener: '',
  };

  const lines = [...prev.basicInfoLines];
  const deltas = Array.isArray(parsed.basic_info_delta) ? parsed.basic_info_delta : [];
  for (const d of deltas) {
    const t = String(d).trim();
    if (!t) continue;
    const exists = lines.some((x) => x === t || x.includes(t) || t.includes(x));
    if (!exists) lines.push(t);
  }

  const basicInfoLines = trimBasicInfoLines(lines);

  const emotional = parsed.emotional_probe?.trim()
    ? clamp(parsed.emotional_probe.trim(), MAX_EMOTIONAL_CHARS)
    : prev.lastEmotionalNote;

  const careOpener = parsed.care_opener?.trim()
    ? clamp(parsed.care_opener.trim(), MAX_CARE_OPENER_CHARS)
    : prev.careOpener;

  const next = {
    schemaVersion: 2,
    basicInfoLines,
    lastEmotionalNote: emotional || '',
    careOpener: careOpener || '',
    lastReflectAt: new Date().toISOString(),
  };

  const hasMeaning =
    next.basicInfoLines.length > 0 ||
    next.lastEmotionalNote.trim() ||
    next.careOpener.trim();

  return hasMeaning ? next : null;
}

/**
 * 匿名会话「新对话」时可清空该会话下的临时长期块
 */
export function clearAnonLongTermMemory(conversationId) {
  const cid = typeof conversationId === 'string' ? conversationId.trim() : '';
  if (!cid) return;
  ltmMem.delete(memStorageKey('anon', cid));
}

/** @param {string} userId @param {string} conversationId */
export function longTermLockKey(userId, conversationId) {
  const uid = normalizeUid(userId);
  if (uid === 'anon') {
    const cid = conversationId?.trim() || 'unknown';
    return `ltm:anon:${cid}`;
  }
  return `ltm:user:${uid}`;
}

/**
 * @param {string} userId
 * @param {string} conversationId
 * @param {() => Promise<T>} fn
 * @template T
 */
export async function runWithLongTermLock(userId, conversationId, fn) {
  const key = longTermLockKey(userId, conversationId);
  return runWithSessionLock(key, fn);
}
