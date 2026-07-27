/**
 * 基于 Firestore 的用户存储，替代 users.json
 */
import admin from './firebaseInit.js';
import { ensureFirebase } from './firebaseInit.js';

function getDb() {
  ensureFirebase();
  if (!admin.apps.length) return null;
  return admin.firestore();
}

/** 获取用户 */
export async function getUser(email) {
  const d = getDb();
  if (!d) return null;
  const snap = await d.collection('users').doc(email).get();
  return snap.exists ? snap.data() : null;
}

/** 创建用户 */
export async function createUser(email, data) {
  const d = getDb();
  if (!d) throw new Error('Firestore 不可用');
  await d.collection('users').doc(email).set({ ...data, email, createdAt: new Date().toISOString() });
}

/** 更新用户 */
export async function updateUser(email, data) {
  const d = getDb();
  if (!d) throw new Error('Firestore 不可用');
  await d.collection('users').doc(email).update(data);
}

/** 检查用户是否存在 */
export async function userExists(email) {
  const d = getDb();
  if (!d) return false;
  const snap = await d.collection('users').doc(email).get();
  return snap.exists;
}
