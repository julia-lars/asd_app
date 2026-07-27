/**
 * Firebase Admin 统一初始化（eager，启动时执行）
 */
import admin from 'firebase-admin';
import { readFileSync } from 'node:fs';
import path from 'node:path';

let initialized = false;

export function ensureFirebase() {
  if (initialized) return true;
  if (admin.apps.length) {
    initialized = true;
    return true;
  }

  try {
    const saPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    if (saPath) {
      const abs = path.isAbsolute(saPath) ? saPath : path.join(process.cwd(), saPath);
      const raw = readFileSync(abs, 'utf8');
      admin.initializeApp({ credential: admin.credential.cert(JSON.parse(raw)) });
      initialized = true;
      console.log('[firebase] Admin SDK 已初始化（service account）');
      return true;
    }
  } catch (err) {
    console.warn('[firebase] service account 初始化失败:', err.message);
  }

  try {
    admin.initializeApp({ credential: admin.credential.applicationDefault() });
    initialized = true;
    console.log('[firebase] Admin SDK 已初始化（ADC）');
    return true;
  } catch (err) {
    console.warn('[firebase] ADC 初始化失败:', err.message);
  }

  return false;
}

export default admin;
