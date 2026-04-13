import { REFLECT_SYSTEM_PROMPT } from './reflectSystemPrompt.js';

/**
 * @param {string} raw
 * @returns {{ basic_info_delta: string[], emotional_probe: string, care_opener: string } | null}
 */
export function parseReflectJson(raw) {
  if (!raw || typeof raw !== 'string') return null;
  let text = raw.trim();
  const fence = /^```(?:json)?\s*([\s\S]*?)```$/m.exec(text);
  if (fence) text = fence[1].trim();
  try {
    const o = JSON.parse(text);
    const basic_info_delta = Array.isArray(o.basic_info_delta)
      ? o.basic_info_delta.map((s) => String(s).trim()).filter(Boolean)
      : [];
    const emotional_probe = typeof o.emotional_probe === 'string' ? o.emotional_probe.trim() : '';
    const care_opener = typeof o.care_opener === 'string' ? o.care_opener.trim() : '';
    if (!basic_info_delta.length && !emotional_probe && !care_opener) return null;
    return { basic_info_delta, emotional_probe, care_opener };
  } catch {
    return null;
  }
}

/**
 * @param {import('@modelcontextprotocol/sdk/client/index.js').Client} client
 * @param {{ userText: string, assistantText: string, previousMemory: object | null }} input
 */
export async function runReflect(client, { userText, assistantText, previousMemory }) {
  const parts = [
    '请根据以下材料输出 JSON（字段见 system 说明）。只输出 JSON。',
    '',
    `【用户】${userText}`,
    `【助手】${assistantText}`,
  ];

  if (previousMemory?.basicInfoLines?.length) {
    parts.push('', '【已有长期记忆——用户侧自述信息（未核验）】');
    for (const b of previousMemory.basicInfoLines) {
      parts.push(`- ${b}`);
    }
  }
  if (previousMemory?.lastEmotionalNote?.trim()) {
    parts.push('', '【当前存档中的「上一轮情绪与支持性观察」（非诊断），本轮可更新或留空表示沿用】');
    parts.push(previousMemory.lastEmotionalNote.trim());
  }

  const reflectModel =
    process.env.DEEPSEEK_REFLECT_MODEL ?? process.env.DEEPSEEK_MODEL ?? 'deepseek-chat';

  const result = await client.callTool({
    name: 'chat_completion',
    arguments: {
      messages: [
        { role: 'system', content: REFLECT_SYSTEM_PROMPT },
        { role: 'user', content: parts.join('\n') },
      ],
      model: reflectModel,
      temperature: 0.25,
      response_format: { type: 'json_object' },
    },
  });

  const raw = result?.structuredContent?.response_text ?? '';
  return parseReflectJson(raw);
}
