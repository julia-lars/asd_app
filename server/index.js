import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

import { FIXED_SYSTEM_PROMPT } from './fixedSystemPrompt.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT ?? 3001);
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

if (!DEEPSEEK_API_KEY) {
  console.warn(
    '[server] 未检测到环境变量 DEEPSEEK_API_KEY。AI 接口将无法调用 DeepSeek。请在 /Users/juliaaa/Desktop/其他/asd_app/server/.env 中配置。',
  );
}

let mcpClientPromise = null;

async function getMcpClient() {
  if (mcpClientPromise) return mcpClientPromise;

  mcpClientPromise = (async () => {
    const deepseekMcpEntry = path.join(
      __dirname,
      'node_modules',
      'deepseek-mcp-server',
      'build',
      'index.js',
    );

    const transport = new StdioClientTransport({
      command: process.execPath,
      args: [deepseekMcpEntry],
      env: {
        DEEPSEEK_API_KEY,
      },
      stderr: 'inherit',
      cwd: __dirname,
    });

    const client = new Client(
      { name: 'asd-app-server', version: '1.0.0' },
      { capabilities: {} },
    );

    await client.connect(transport);
    return client;
  })();

  return mcpClientPromise;
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, systemPrompt } = req.body ?? {};
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'message 不能为空' });
      return;
    }

    if (systemPrompt && typeof systemPrompt !== 'string') {
      res.status(400).json({ error: 'systemPrompt 必须是字符串' });
      return;
    }

    if (!DEEPSEEK_API_KEY) {
      res.status(500).json({ error: '未配置 DEEPSEEK_API_KEY' });
      return;
    }

    const client = await getMcpClient();

    const systemParts = [];
    if (FIXED_SYSTEM_PROMPT.trim()) {
      systemParts.push(FIXED_SYSTEM_PROMPT.trim());
    }
    if (systemPrompt?.trim()) {
      systemParts.push(systemPrompt.trim());
    }
    const combinedSystem = systemParts.join('\n\n');

    const messages = [
      ...(combinedSystem
        ? [
            {
              role: 'system',
              content: combinedSystem,
            },
          ]
        : []),
      { role: 'user', content: message },
    ];

    const result = await client.callTool({
      name: 'chat_completion',
      arguments: {
        messages,
        model: process.env.DEEPSEEK_MODEL ?? 'deepseek-chat',
        temperature: 0.7,
      },
    });

    const text = result?.structuredContent?.response_text ?? '';
    res.json({ text });
  } catch (error) {
    console.error('[server] /api/ai/chat error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});

