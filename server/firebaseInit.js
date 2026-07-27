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
      // Render 的 Secret File 默认挂载在 /etc/secrets/ 下
      const candidates = [
        saPath,
        path.join('/etc/secrets', saPath),
        path.join(process.cwd(), saPath),
      ];
      let raw = null;
      for (const p of candidates) {
        try { raw = readFileSync(p, 'utf8'); console.log('[firebase] 从', p, '读取密钥'); break; }
        catch {}
      }
      if (!raw) throw new Error('无法读取密钥文件，尝试了: ' + candidates.join(', '));
      const sa = JSON.parse(raw);
      admin.initializeApp({
        credential: admin.credential.cert(sa),
        projectId: sa.project_id,
      });
      initialized = true;
      console.log('[firebase] Admin SDK 已初始化（service account）project:', sa.project_id);
      return true;
    }
  } catch (err) {
    console.warn('[firebase] service account 初始化失败:', err.message);
  }

  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: 'asd-app-4e926',
    });
    initialized = true;
    console.log('[firebase] Admin SDK 已初始化（ADC）');
    return true;
  } catch (err) {
    console.warn('[firebase] ADC 初始化失败:', err.message);
  }

  return false;
}

export default admin;
