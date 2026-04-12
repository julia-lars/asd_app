import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '.env') });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 8787);
const MCP_ENTRY = path.join(__dirname, 'node_modules', 'deepseek-mcp-server', 'build', 'index.js');
const DEFAULT_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

let mcpClientPromise = null;

function getDeepseekApiKey() {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key || !String(key).trim()) {
    return null;
  }
  return String(key).trim();
}

async function getMcpClient() {
  const apiKey = getDeepseekApiKey();
  if (!apiKey) {
    throw new Error('缺少环境变量 DEEPSEEK_API_KEY。请在 server/.env 中配置（见 server/.env.example）。');
  }

  if (!mcpClientPromise) {
    mcpClientPromise = (async () => {
      const transport = new StdioClientTransport({
        command: process.execPath,
        args: [MCP_ENTRY],
        env: {
          DEEPSEEK_API_KEY: apiKey
        },
        stderr: 'pipe'
      });

      const client = new Client({ name: 'asd-app-mcp-bridge', version: '1.0.0' }, { capabilities: {} });
      await client.connect(transport);

      const tools = await client.listTools();
      client.cacheToolMetadata(tools.tools ?? []);

      return client;
    })().catch((err) => {
      mcpClientPromise = null;
      throw err;
    });
  }

  return mcpClientPromise;
}

function extractAssistantText(result) {
  if (result?.isError) {
    const block = result.content?.[0];
    const msg = block?.type === 'text' ? block.text : JSON.stringify(result.content);
    throw new Error(msg || 'MCP 工具返回错误');
  }

  const sc = result?.structuredContent;
  if (sc && typeof sc.response_text === 'string' && sc.response_text.trim()) {
    return sc.response_text.trim();
  }

  const parts = result?.content ?? [];
  const texts = parts.filter((p) => p.type === 'text').map((p) => p.text);
  const joined = texts.join('\n').trim();
  if (joined) return joined;

  throw new Error('模型未返回可读文本，请稍后重试。');
}

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', async (_req, res) => {
  try {
    if (!getDeepseekApiKey()) {
      return res.status(503).json({ ok: false, error: 'DEEPSEEK_API_KEY 未配置' });
    }
    const client = await getMcpClient();
    await client.listTools();
    return res.json({ ok: true, via: 'mcp', tool: 'deepseek-mcp-server (chat_completion)' });
  } catch (e) {
    return res.status(503).json({ ok: false, error: e instanceof Error ? e.message : String(e) });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { systemPrompt, messages: rawMessages, model } = req.body ?? {};

    if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
      return res.status(400).json({ error: 'messages 必须为非空数组' });
    }

    const system = typeof systemPrompt === 'string' ? systemPrompt.trim() : '';
    const mcpMessages = [];

    if (system) {
      mcpMessages.push({ role: 'system', content: system });
    }

    for (const m of rawMessages) {
      if (!m || (m.role !== 'user' && m.role !== 'assistant')) continue;
      const content = typeof m.content === 'string' ? m.content : '';
      if (!content.trim()) continue;
      mcpMessages.push({ role: m.role, content: content.trim() });
    }

    if (mcpMessages.length === 0 || !mcpMessages.some((m) => m.role === 'user')) {
      return res.status(400).json({ error: '至少需要一条用户消息' });
    }

    const client = await getMcpClient();
    const result = await client.callTool({
      name: 'chat_completion',
      arguments: {
        messages: mcpMessages,
        model: typeof model === 'string' && model.trim() ? model.trim() : DEFAULT_MODEL,
        stream: false
      }
    });

    const reply = extractAssistantText(result);
    return res.json({ reply });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('[api/chat]', message);
    return res.status(502).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.error(`MCP 桥接服务已监听 http://127.0.0.1:${PORT}（DeepSeek 经 deepseek-mcp-server / MCP）`);
});
