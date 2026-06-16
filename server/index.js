import 'dotenv/config';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

import { buildLongTermContext } from './buildDynamicContext.js';
import { getFixedSystemPrompt } from './fixedSystemPrompt.js';
import { localeFromRequest, serverMessage } from './locale.js';
import { runReflect } from './reflect.js';
import {
  clearAnonLongTermMemory,
  getLongTermMemory,
  isFirestoreReflectConfigured,
  mergeReflectIntoMemory,
  runWithLongTermLock,
  saveLongTermMemory,
} from './longTermMemory.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT ?? 3001);
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
/** `stdio`：本地子进程 deepseek-mcp-server（需 DEEPSEEK_API_KEY）。`http`：远程 Streamable HTTP MCP（需 DEEPSEEK_MCP_AUTH_TOKEN）。 */
const MCP_TRANSPORT = (process.env.MCP_TRANSPORT ?? 'stdio').toLowerCase();
const DEEPSEEK_MCP_URL = process.env.DEEPSEEK_MCP_URL ?? 'https://deepseek-mcp.ragweld.com/mcp';
const DEEPSEEK_MCP_AUTH_TOKEN = process.env.DEEPSEEK_MCP_AUTH_TOKEN;

if (MCP_TRANSPORT === 'stdio' && !DEEPSEEK_API_KEY) {
  console.warn(
    '[server] MCP_TRANSPORT=stdio 但未检测到 DEEPSEEK_API_KEY。请在 server 目录下的 .env 中配置，或使用 MCP_TRANSPORT=http + DEEPSEEK_MCP_AUTH_TOKEN。',
  );
}

if (MCP_TRANSPORT === 'http' && !DEEPSEEK_MCP_AUTH_TOKEN) {
  console.warn(
    '[server] MCP_TRANSPORT=http 但未检测到 DEEPSEEK_MCP_AUTH_TOKEN。远程 MCP 将无法鉴权。',
  );
}

let mcpClientPromise = null;

function createMcpTransport() {
  if (MCP_TRANSPORT === 'http') {
    const url = new URL(DEEPSEEK_MCP_URL);
    const headers = {};
    if (DEEPSEEK_MCP_AUTH_TOKEN) {
      headers.Authorization = `Bearer ${DEEPSEEK_MCP_AUTH_TOKEN}`;
    }
    return new StreamableHTTPClientTransport(url, {
      requestInit: { headers },
    });
  }

  const deepseekMcpEntry = path.join(
    __dirname,
    'node_modules',
    'deepseek-mcp-server',
    'build',
    'index.js',
  );

  return new StdioClientTransport({
    command: process.execPath,
    args: [deepseekMcpEntry],
    env: {
      DEEPSEEK_API_KEY,
    },
    stderr: 'inherit',
    cwd: __dirname,
  });
}

/** MCP chat_completion 返回：正常在 structuredContent；API 错误时为 isError + content 文本 */
function textFromMcpToolResult(result) {
  const sc = result?.structuredContent;
  if (sc && typeof sc.response_text === 'string') return sc.response_text;
  if (result?.isError && Array.isArray(result.content)) {
    return result.content
      .map((c) => (c?.type === 'text' && c.text ? String(c.text) : ''))
      .filter(Boolean)
      .join('\n');
  }
  return '';
}

const REFLECT_TIMEOUT_MS = Number(process.env.REFLECT_TIMEOUT_MS ?? 25000);
const CHAT_MAX_TOKENS = Number.parseInt(process.env.DEEPSEEK_MAX_TOKENS ?? '700', 10);

async function getMcpClient() {
  if (mcpClientPromise) return mcpClientPromise;

  mcpClientPromise = (async () => {
    const transport = createMcpTransport();
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

/* ========== JWT Auth ========== */
const JWT_SECRET = process.env.JWT_SECRET || 'asd-app-jwt-secret-change-in-production';
const USERS_FILE = path.join(__dirname, 'users.json');

let users = {};
function loadUsers() {
  if (existsSync(USERS_FILE)) {
    try {
      users = JSON.parse(readFileSync(USERS_FILE, 'utf-8'));
    } catch {
      users = {};
    }
  }
}
function saveUsers() {
  writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}
loadUsers();

function authMiddleware(req, res, next) {
  const locale = localeFromRequest(req);
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: serverMessage('auth.not_logged_in', locale) });
  }
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: serverMessage('auth.expired', locale) });
  }
}

app.post('/api/auth/register', async (req, res) => {
  const locale = localeFromRequest(req);
  try {
    const { email, password, name } = req.body ?? {};
    if (!email || !password) {
      return res.status(400).json({ error: serverMessage('auth.email_password_required', locale) });
    }
    if (users[email]) {
      return res.status(400).json({ error: serverMessage('auth.email_registered', locale) });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    users[email] = {
      email,
      name: name || email.split('@')[0],
      password: hashedPassword,
      role: 'family',
      createdAt: new Date().toISOString(),
    };
    saveUsers();
    const token = jwt.sign({ email, uid: email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { email, name: name || email.split('@')[0], uid: email } });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const locale = localeFromRequest(req);
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res.status(400).json({ error: serverMessage('auth.email_password_required', locale) });
    }
    const user = users[email];
    if (!user) {
      return res.status(400).json({ error: serverMessage('auth.invalid_credentials', locale) });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: serverMessage('auth.invalid_credentials', locale) });
    }
    const token = jwt.sign({ email, uid: email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { email, name: user.name, uid: email } });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const locale = localeFromRequest(req);
  const user = users[req.user.email];
  if (!user) {
    return res.status(401).json({ error: serverMessage('auth.user_missing', locale) });
  }
  res.json({ user: { email: user.email, name: user.name, uid: user.email } });
});

app.post('/api/auth/password', authMiddleware, async (req, res) => {
  const locale = localeFromRequest(req);
  try {
    const user = users[req.user.email];
    if (!user) {
      return res.status(401).json({ error: serverMessage('auth.user_missing', locale) });
    }

    const { currentPassword, newPassword } = req.body ?? {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: serverMessage('auth.password_fields_required', locale) });
    }
    if (String(newPassword).length < 6) {
      return res.status(400).json({ error: serverMessage('auth.password_too_short', locale) });
    }

    const valid = await bcrypt.compare(String(currentPassword), user.password);
    if (!valid) {
      return res.status(400).json({ error: serverMessage('auth.current_password_wrong', locale) });
    }

    users[req.user.email] = {
      ...user,
      password: await bcrypt.hash(String(newPassword), 10),
      passwordUpdatedAt: new Date().toISOString(),
    };
    saveUsers();
    res.json({ ok: true, message: serverMessage('auth.password_updated', locale) });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

/* ========== Existing Routes ========== */

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    reflectStore: isFirestoreReflectConfigured() ? 'firestore' : 'memory',
  });
});

function normalizeUserId(userId) {
  return typeof userId === 'string' && userId.trim() ? userId.trim() : '';
}

/** 供前端展示的长期记忆子集（不含 careOpener，避免干扰 UI） */
function memoryToReflectPayload(memory) {
  if (!memory) return null;
  return {
    basicInfoLines: memory.basicInfoLines ?? [],
    lastEmotionalNote: memory.lastEmotionalNote ?? '',
  };
}

app.get('/api/ai/session', async (req, res) => {
  const locale = localeFromRequest(req);
  const userId = normalizeUserId(req.query.userId);
  const conversationId = typeof req.query.conversationId === 'string' ? req.query.conversationId : '';
  if (!conversationId.trim()) {
    res.status(400).json({ error: serverMessage('ai.conversation_required', locale) });
    return;
  }
  try {
    const memory = await getLongTermMemory(userId || 'anon', conversationId.trim());
    res.json({
      conversationId: conversationId.trim(),
      reflect: memoryToReflectPayload(memory),
    });
  } catch (err) {
    console.error('[server] GET /api/ai/session', err);
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

app.post('/api/ai/chat', async (req, res) => {
  const locale = localeFromRequest(req);
  try {
    const { message, systemPrompt, conversationId: bodyCid, userId } = req.body ?? {};
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: serverMessage('ai.message_required', locale) });
      return;
    }

    if (systemPrompt && typeof systemPrompt !== 'string') {
      res.status(400).json({ error: serverMessage('ai.system_prompt_string', locale) });
      return;
    }

    if (bodyCid !== undefined && bodyCid !== null && typeof bodyCid !== 'string') {
      res.status(400).json({ error: serverMessage('ai.conversation_string', locale) });
      return;
    }

    if (MCP_TRANSPORT === 'stdio' && !DEEPSEEK_API_KEY) {
      res.status(500).json({ error: serverMessage('ai.deepseek_key_missing', locale) });
      return;
    }

    if (MCP_TRANSPORT === 'http' && !DEEPSEEK_MCP_AUTH_TOKEN) {
      res.status(500).json({ error: serverMessage('ai.mcp_token_missing', locale) });
      return;
    }

    const conversationId =
      typeof bodyCid === 'string' && bodyCid.trim() ? bodyCid.trim() : crypto.randomUUID();
    const uidForLtm = normalizeUserId(userId) || 'anon';

    const payload = await runWithLongTermLock(uidForLtm, conversationId, async () => {
      const client = await getMcpClient();
      const previousMemory = await getLongTermMemory(uidForLtm, conversationId);
      const dynamicBlock = buildLongTermContext(previousMemory, locale);

      const systemParts = [];
      const fixedSystemPrompt = getFixedSystemPrompt(locale);
      if (fixedSystemPrompt.trim()) {
        systemParts.push(fixedSystemPrompt.trim());
      }
      if (dynamicBlock) {
        systemParts.push(dynamicBlock);
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
          max_tokens: Number.isFinite(CHAT_MAX_TOKENS) && CHAT_MAX_TOKENS > 0 ? CHAT_MAX_TOKENS : 700,
        },
      });

      const text = textFromMcpToolResult(result);

      let reflectPayload = null;
      let reflectOk = false;
      try {
        const parsed = await Promise.race([
          runReflect(client, {
            userText: message,
            assistantText: text || serverMessage('ai.empty_reply', locale),
            previousMemory,
            locale,
          }),
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error(serverMessage('ai.reflect_timeout', locale))), REFLECT_TIMEOUT_MS);
          }),
        ]);
        if (parsed) {
          const nextState = mergeReflectIntoMemory(previousMemory, parsed);
          if (nextState) {
            reflectOk = true;
            await saveLongTermMemory(uidForLtm, conversationId, nextState);
            reflectPayload = memoryToReflectPayload(nextState);
          }
        }
      } catch (reflectErr) {
        console.error('[server] reflect failed (主对话仍成功):', reflectErr);
      }

      return {
        text,
        conversationId,
        reflect: reflectPayload,
        reflectOk,
      };
    });

    res.json(payload);
  } catch (error) {
    console.error('[server] /api/ai/chat error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

/**
 * 匿名会话可清空临时长期记忆；已登录用户长期记忆跨对话保留，此接口对其不删除 Firestore/内存档案。
 */
app.post('/api/ai/session/reset', async (req, res) => {
  const locale = localeFromRequest(req);
  const { conversationId, userId } = req.body ?? {};
  if (!conversationId || typeof conversationId !== 'string') {
    res.status(400).json({ error: serverMessage('ai.session_reset_required', locale) });
    return;
  }
  const uid = normalizeUserId(userId);
  try {
    if (!uid) {
      clearAnonLongTermMemory(conversationId.trim());
    }
    res.json({
      ok: true,
      clearedLongTerm: !uid,
      note: uid
        ? serverMessage('ai.session_reset_user_note', locale)
        : serverMessage('ai.session_reset_anon_note', locale),
    });
  } catch (err) {
    console.error('[server] POST /api/ai/session/reset', err);
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
  console.log(
    `[server] DeepSeek MCP: transport=${MCP_TRANSPORT}${MCP_TRANSPORT === 'http' ? ` url=${DEEPSEEK_MCP_URL}` : ' (local deepseek-mcp-server)'}`,
  );
  if (isFirestoreReflectConfigured()) {
    console.log('[server] 已配置 FIRESTORE_REFLECT：登录用户长期记忆将写入 Firestore（见 README）');
  } else {
    console.log('[server] 未启用 FIRESTORE_REFLECT：长期记忆仅存进程内存，重启丢失');
  }
});
