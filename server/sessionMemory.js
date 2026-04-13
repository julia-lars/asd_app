const lockChains = new Map();

/**
 * 同一 lockKey 内串行执行，避免连发两条消息时长期记忆 / 对话竞态
 * @param {string} lockKey
 * @param {() => Promise<T>} fn
 * @template T
 */
export async function runWithSessionLock(lockKey, fn) {
  const prev = lockChains.get(lockKey) ?? Promise.resolve();
  let resolveNext;
  const next = new Promise((resolve) => {
    resolveNext = resolve;
  });
  lockChains.set(lockKey, prev.then(() => next));
  await prev;
  try {
    return await fn();
  } finally {
    resolveNext();
  }
}
