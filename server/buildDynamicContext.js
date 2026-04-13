/**
 * 将用户级长期记忆注入主对话 system（非诊断免责声明）
 * @param {import('./longTermMemory.js').LongTermMemoryState | null | undefined} memory
 */
export function buildLongTermContext(memory) {
  if (!memory) return '';
  const { basicInfoLines = [], lastEmotionalNote = '', careOpener = '' } = memory;
  if (!basicInfoLines.length && !lastEmotionalNote.trim() && !careOpener.trim()) return '';

  const lines = [
    '【用户长期记忆（来自历史对话归纳，用户自述未核验，非医疗诊断）】',
    '以下信息仅用于保持对话连贯与语气关怀，若与用户当前说法冲突，以用户当下表述为准。',
    '',
  ];

  if (basicInfoLines.length) {
    lines.push('【已知背景要点】');
    for (const b of basicInfoLines) lines.push(`- ${b}`);
    lines.push('');
  }

  if (lastEmotionalNote.trim()) {
    lines.push('【上一轮对话中对其情绪与支持需求的观察（非诊断）】');
    lines.push(lastEmotionalNote.trim());
    lines.push('');
  }

  if (careOpener.trim()) {
    lines.push('【建议开场】用户再次发言时，可先自然表达一句关心（可参考下句，允许改写）：');
    lines.push(`「${careOpener.trim()}」`);
    lines.push('');
  }

  lines.push('请先简短表达关心或承接其处境，再回答用户本轮问题。');
  return lines.join('\n').trim();
}
