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

  // 方式 1：环境变量 GOOGLE_APPLICATION_CREDENTIALS_JSON
  const jsonEnv = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (jsonEnv) {
    try {
      const sa = JSON.parse(jsonEnv);
      admin.initializeApp({
        credential: admin.credential.cert(sa),
        projectId: sa.project_id || 'asd-app-4e926',
      });
      initialized = true;
      console.log('[firebase] Admin SDK 已初始化（环境变量 JSON）');
      return true;
    } catch (err) {
      console.warn('[firebase] JSON 解析失败:', err.message);
      console.warn('[firebase] JSON 前100字符:', jsonEnv.substring(0, 100));
    }
  }

  // 方式 2：文件路径
  const saPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (saPath) {
    try {
      const candidates = [
        saPath,
        path.join('/etc/secrets', saPath),
        path.join(process.cwd(), saPath),
      ];
      let raw = null;
      for (const p of candidates) {
        try { raw = readFileSync(p, 'utf8'); break; } catch {}
      }
      if (raw) {
        const sa = JSON.parse(raw);
        admin.initializeApp({
          credential: admin.credential.cert(sa),
          projectId: sa.project_id || 'asd-app-4e926',
        });
        initialized = true;
        console.log('[firebase] Admin SDK 已初始化（文件）');
        return true;
      }
    } catch (err) {
      console.warn('[firebase] 文件读取失败:', err.message);
    }
  }

  // 方式 3：ADC（需要 GOOGLE_CLOUD_PROJECT）
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.GOOGLE_CLOUD_PROJECT || 'asd-app-4e926',
    });
    initialized = true;
    console.log('[firebase] Admin SDK 已初始化（ADC）');
    return true;
  } catch (err) {
    console.warn('[firebase] 所有初始化方式均失败:', err.message);
  }

  return false;
}

export default admin;
