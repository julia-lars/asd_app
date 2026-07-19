# 孤独症支持平台：AI 安全机制与网站转 APP 调研及修改计划

> 生成日期：2026-07-14  
> 基于仓库版本：main 分支当前代码

---

## 1. 任务背景与项目现状

### 1.1 项目结构

当前 `asd_app` 是一个面向孤独症患者家属的 Web 应用，技术栈为：

- **前端**：React 19 + Vite 7 + Tailwind CSS 4 + React Router 7
- **后端**：Express 5 + MCP（`deepseek-mcp-server`）调用 DeepSeek API
- **数据/认证**：Firebase Firestore（社交动态）+ 自建 JWT 用户体系（`server/users.json`）
- **AI 特性**：服务端固定 Prompt + 每轮对话后的 reflect（长期记忆归纳）

关键文件：

| 模块 | 文件 |
|------|------|
| AI 对话后端 | `server/index.js`、`server/fixedSystemPrompt.js`、`server/reflect.js`、`server/reflectSystemPrompt.js`、`server/longTermMemory.js` |
| AI 对话前端 | `frontend/src/pages/AiChat/AiChat.jsx` |
| 知识图谱 | `frontend/src/pages/Help/KnowledgeGraphPage.jsx`、`frontend/src/data/kg-graph.json` |
| 社交/社区 | `frontend/src/pages/Social/Social.jsx` |
| 认证 | `frontend/src/contexts/AuthContext.jsx`、`server/index.js` |

### 1.2 两个待解决问题

1. **AI 安全性**：如何在现有 DeepSeek 对话链路中建立**引用溯源**、**约束校验**、**拒绝不当请求**的机制。
2. **从网站到 APP**：如何以最低成本、可持续维护的方式，把现有的 React Web 应用延伸到移动端 APP（iOS/Android）。

---

## 2. 任务一：AI 安全性三机制

### 2.1 现状梳理

#### 2.1.1 已有基础

- `server/fixedSystemPrompt.js` 已要求模型：
  - 语气温和、不做医疗诊断
  - 回答简短、不要加粗 Markdown
  - **引用可信来源**（PubMed/PMC、CDC、WHO、NICE、AAP 等），并自然写进正文
  - 若无法确认精准文章标题，要说「我需要进一步查证具体文献」
- `server/reflectSystemPrompt.js` 要求 reflect 输出严格 JSON，且**不做诊断**，只记录事实性自述。
- `server/index.js` 对请求参数做了基础校验（`message`、`systemPrompt`、`conversationId` 类型检查）。
- `server/reflect.js` 对 reflect 返回做了 JSON 解析与字段归一化。

#### 2.1.2 当前缺失

| 维度 | 现状 | 风险 |
|------|------|------|
| **引用溯源** | 仅靠 Prompt 软约束，无结构化输出与校验 | 模型可能编造论文题名/DOI/机构名；用户无法核实；出现医疗建议时责任不清 |
| **约束校验** | 仅参数类型校验，无输入内容策略、无输出后校验 | 用户可输入诱导性/有害请求；模型输出可能过长、包含禁用格式或违反 disclaimer |
| **拒绝不当请求** | 仅靠固定 Prompt 中的「语气温和、不做诊断」 | 对极端、自伤、暴力、歧视、医疗误诊等请求无明确拒绝策略与兜底 |

---

### 2.2 目标一：引用溯源（Citation Traceability）

#### 2.2.1 推荐方案

采用 **「结构化引用 + 可信域白名单 + 来源卡片 + 审计日志」** 四层机制。

1. **结构化引用 Prompt**  
   在 `fixedSystemPrompt.js` 中要求模型：
   - 每次给出医学/干预/发育相关事实时，必须在正文中以 `〔来源：XXX, 标题〕` 形式标注。
   - 若引用期刊，优先给出 **PubMed PMID 或 DOI**；若引用机构指南，给出机构名与指南名。
   - 禁止编造 DOI/PMID；无法确认时必须说明「该说法基于一般性知识，非特定文献」。

2. **引用元数据白名单**  
   在 `server/index.js` 中对模型返回做轻量后处理：
   - 提取文本中的引用标记（正则或 LLM 二次解析）。
   - 校验引用域名/机构是否在白名单（`pubmed.ncbi.nlm.nih.gov`、`cdc.gov`、`who.int`、`nice.org.uk`、`aap.org`、`autismspeaks.org` 等）。
   - 对可疑引用（无法匹配白名单、DOI 格式异常）在前端显示「来源待核实」提示。

3. **前端来源卡片**  
   在 `AiChat.jsx` 中：
   - 对 assistant 消息做引用提取，将引用渲染为可点击的 source chips。
   - 点击后弹出来源说明（机构、标题、可信度标签、免责声明）。

4. **审计日志**  
   在服务端新增 `server/auditLogger.js`：
   - 记录每次对话的 `traceId`、用户 ID、输入、输出、使用模型、温度、引用列表。
   - 日志写入本地文件或 Firestore（按需），便于事后追溯与合规审查。

#### 2.2.2 实施步骤

| 步骤 | 文件 | 改动要点 |
|------|------|----------|
| 1 | `server/fixedSystemPrompt.js` | 追加结构化引用规则、可信来源白名单、禁止编造 DOI/PMID |
| 2 | 新增 `server/citationValidator.js` | 提取引用、校验白名单、标记可疑引用、生成来源卡片数据 |
| 3 | `server/index.js` | 在 `/api/ai/chat` 返回前调用 citationValidator；返回 `citations` 字段 |
| 4 | `frontend/src/pages/AiChat/AiChat.jsx` | 渲染引用 chips 与来源说明弹窗 |
| 5 | 新增 `server/auditLogger.js` | 记录 traceId / userId / prompt / output / citations |
| 6 | 测试 | 构造编造 DOI、无来源医疗建议、可信来源三类输入，验证引用校验行为 |

#### 2.2.3 关键设计约束

- **不要在前端暴露 DeepSeek API Key**（当前已做到）。
- 引用校验失败**不应阻塞主回复**（降级为「来源待核实」标签）。
- 所有医学相关回复保持 disclaimer：「AI 仅提供一般建议，不能替代医疗诊断」。

---

### 2.3 目标二：约束校验（Constraint Validation）

#### 2.3.1 推荐方案

采用 **「输入层校验 + 模型参数约束 + 输出层后校验 + 速率限制」** 四道防线。

1. **输入层校验**
   - 消息长度上限（如 2000 字符）。
   - 禁止空消息、超大消息、非字符串类型（已有基础，可加强）。
   - 增加**简单策略过滤器**：检测自伤/自杀、暴力、极端歧视、Prompt 注入等关键词（中文/英文）。命中后走专门拒绝流程，并记录。
   - 对 systemPrompt 注入做更严格限制：仅允许服务端固定 Prompt，前端不再透传自定义 systemPrompt（当前前端已不传，但接口仍接受，建议加白名单或移除）。

2. **模型参数约束**
   - `max_tokens` 已配置（`CHAT_MAX_TOKENS`），建议按场景动态调整：医疗/情绪支持类回答不超过 700 tokens。
   - `temperature` 保持 0.5–0.7，避免过高导致胡说。
   - 对 reflect 使用独立模型（`DEEPSEEK_REFLECT_MODEL`），temperature 更低（0.1–0.3），并强制 `response_format: { type: 'json_object' }`。

3. **输出层后校验**
   - **长度校验**：若返回超过阈值，截断并提示「回答较长，已截断」。
   - **格式校验**：移除 `**` 加粗（前端已有 `stripAssistantBoldMarkers`），可扩展为移除 Markdown 链接、单独 URL。
   - **医疗免责声明校验**：若回答涉及诊断/用药/干预方案但未包含 disclaimer，自动追加。
   - **敏感词/有害内容校验**：对返回文本跑一遍策略过滤器，命中则替换为兜底文案。

4. **速率限制**
   - 按 `userId` 或 IP 限制每 60 秒最大请求数（如 20 条），防止滥用与成本失控。
   - 可用 `express-rate-limit` 或基于内存/Firestore 的计数器。

#### 2.3.2 实施步骤

| 步骤 | 文件 | 改动要点 |
|------|------|----------|
| 1 | 新增 `server/inputGuard.js` | 输入长度检查、策略关键词过滤器、Prompt 注入检测 |
| 2 | 新增 `server/outputGuard.js` | 输出长度/格式/免责声明/敏感词校验与修正 |
| 3 | `server/index.js` | 在 `/api/ai/chat` 中集成 inputGuard 与 outputGuard；移除或限制 `systemPrompt` 接口字段 |
| 4 | `server/reflect.js` | 加强 JSON schema 校验（zod），对字段缺失/类型错误降级处理 |
| 5 | 新增 `server/rateLimiter.js` | 基于内存 + Firestore 的 per-user 速率限制 |
| 6 | `frontend/src/pages/AiChat/AiChat.jsx` | 增加输入字数提示、发送前前端校验 |

---

### 2.4 目标三：拒绝不当请求（Refusal of Inappropriate Requests）

#### 2.4.1 推荐方案

采用 **「策略层 + 模型层 + 人工兜底」** 三层拒绝机制。

1. **策略层（规则过滤）**
   - 维护一份不当请求分类词库：
     - 自伤/自杀相关
     - 伤害他人/儿童相关
     - 歧视/侮辱孤独症群体
     - 诱导 AI 给出诊断/处方/替代专业治疗
     - Prompt 注入/越狱
   - 命中后返回固定拒绝文案（多语言），并触发安全日志。

2. **模型层（LLM-as-Judge）**
   - 在 `/api/ai/chat` 主调用前，增加一次轻量的「安全判断」调用（可用更小更快模型，或同一模型但低 token）。
   - 输入：用户消息 + 历史上下文；输出 JSON：`{ "safe": boolean, "category": string, "reason": string }`。
   - 若 `safe: false`，直接返回拒绝文案，不走主模型。
   - 为控制成本，可先对触发策略层的消息做 Judge，未触发策略层但敏感的消息才走 Judge。

3. **内容层（固定 Prompt 强化）**
   - 在 `fixedSystemPrompt.js` 中明确列出：
     - 拒绝提供诊断、处方、具体剂量。
     - 拒绝支持自伤/暴力/虐待。
     - 拒绝歧视性语言。
     - 对医疗问题必须建议咨询持证医生。

4. **人工兜底**
   - 对拒绝事件记录 `safetyIncident` 日志（时间、用户、分类、原始消息、处理结果）。
   - 预留管理员后台接口（未来扩展）。

#### 2.4.2 实施步骤

| 步骤 | 文件 | 改动要点 |
|------|------|----------|
| 1 | 新增 `server/safetyPolicy.js` | 不当请求分类、拒绝文案多语言映射 |
| 2 | 新增 `server/safetyGuard.js` | 策略关键词匹配 + LLM Judge 调用 + 事件日志 |
| 3 | `server/fixedSystemPrompt.js` | 强化拒绝条款与医疗免责声明 |
| 4 | `server/index.js` | `/api/ai/chat` 先过 safetyGuard，拒绝请求不调用主模型 |
| 5 | 新增 `server/safetyLogger.js` | 记录安全事件到文件/Firestore |
| 6 | `frontend/src/pages/AiChat/AiChat.jsx` | 对拒绝文案做温和 UI 展示（不显示红色报错，避免刺激用户） |

---

### 2.5 任务一优先级建议

| 优先级 | 事项 | 理由 |
|--------|------|------|
| P0 | 固定 Prompt 强化 + 输入/输出基础校验 + 速率限制 | 成本低、见效快，能拦截大部分明显风险 |
| P1 | 安全策略层 + 拒绝不当请求 | 涉及用户安全（自伤、虐待、医疗误诊），必须尽快落地 |
| P2 | 结构化引用与来源卡片 | 提升可信度，但实现与校验成本较高 |
| P3 | LLM-as-Judge + 审计日志 | 精度高但成本高，可在 P0/P1 稳定后迭代 |

---

## 3. 任务二：从网站跨越到 APP 形式

### 3.1 可选方案对比

针对当前 **React + Vite** 前端，常见移动化路径有四种：

| 方案 | 技术本质 | 优点 | 缺点 | 适合场景 |
|------|----------|------|------|----------|
| **PWA（渐进式 Web 应用）** | 给网站加 manifest + Service Worker，可安装到主屏幕 | 成本最低、同一份代码、无需应用商店、可离线 | 无法上架 App Store/Google Play（iOS 限制）、推送能力受限、部分原生 API 不可用 | 先做移动体验，不上架商店 |
| **Capacitor / Cordova 混合应用** | 用 WebView 加载 Web 构建产物，加原生壳 | 成本低、复用现有代码、可上架商店、可调原生 API | 性能略低于纯原生、部分复杂交互需原生插件 | 需要商店分发但不想重写 |
| **React Native** | 用 React 写真正原生组件 | 性能接近原生、社区生态大 | 需重写大量 UI/路由/状态逻辑，与现有 Vite 项目不兼容 | 追求原生体验且预算充足 |
| **Flutter** | 完全重写 Dart 代码 | 跨平台一致、性能优秀 | 技术栈完全不同，成本最高 | 长期战略级重构 |

### 3.2 推荐路径

**推荐采用「PWA 先行 → Capacitor 混合应用上架」的两阶段策略。**

理由：

1. 现有前端已是响应式 React，PWA 改造只需几天即可让用户「像 APP 一样使用」。
2. Capacitor 能直接把 Vite 构建产物（`dist`）打包成 iOS/Android 工程，**无需重写业务代码**。
3. 社交、AI 对话、知识图谱均以 Web 组件为主，Capacitor 完全满足。
4. 未来若需要极高性能的原生模块，再逐步用 Capacitor 插件或 React Native 模块替换。

### 3.3 阶段一：PWA 改造（1–2 周）

#### 3.3.1 改造清单

| 步骤 | 文件/操作 | 改动要点 |
|------|-----------|----------|
| 1 | `frontend/package.json` | 安装 `vite-plugin-pwa` |
| 2 | `frontend/vite.config.js` | 注册 PWA 插件，配置 manifest、Service Worker 策略 |
| 3 | 新增 `frontend/public/manifest.json` | 应用名称、图标、主题色、启动方式、显示模式（`standalone`） |
| 4 | `frontend/index.html` | 添加 `<link rel="manifest" …>`、主题色、viewport 优化 |
| 5 | 新增/替换图标 | 提供 192×192、512×512 等 PNG 图标 |
| 6 | `frontend/src/main.jsx` | 注册 Service Worker（`vite-plugin-pwa` 自动生成） |
| 7 | 适配移动端样式 | 调整 `px-[80px]` 等宽屏边距为移动端安全边距；处理底部导航栏高度与 `safe-area-inset-bottom` |

#### 3.3.2 移动端 UI 关键调整

当前页面大量使用 `px-[80px]`，在手机上会出现巨大白边，需：

- 将固定大边距改为响应式边距（如 `px-4 md:px-8 lg:px-20`）。
- 顶部导航栏使用 `env(safe-area-inset-top)`。
- 底部 `BottomNav` 增加 `pb-[env(safe-area-inset-bottom)]`。
- 输入框、按钮适当增加触控区域（最小 44×44 dp）。

### 3.4 阶段二：Capacitor 混合应用（2–4 周）

#### 3.4.1 改造清单

| 步骤 | 命令/文件 | 改动要点 |
|------|-----------|----------|
| 1 | `cd frontend && npm install @capacitor/core @capacitor/cli` | 安装 Capacitor |
| 2 | `npx cap init` | 初始化配置 `capacitor.config.ts`，`appId` 建议 `com.asdapp.family`，`webDir: 'dist'` |
| 3 | `npm install @capacitor/ios @capacitor/android && npx cap add ios && npx cap add android` | 添加 iOS/Android 原生工程 |
| 4 | `frontend/package.json` | 增加脚本：`"build:mobile": "npm run build && npx cap sync"`、`"cap:ios": "npx cap open ios"`、`"cap:android": "npx cap open android"` |
| 5 | `frontend/vite.config.js` | 生产构建配置 `base: './'` 或绝对域名，确保在 WebView 内路径正确 |
| 6 | 新增平台判断工具 | `import { Capacitor } from '@capacitor/core'`，区分 web/iOS/Android 行为 |
| 7 | API 基地址 | 生产环境通过 `VITE_API_BASE_URL` 指向真实后端域名；开发时仍用 Vite proxy |
| 8 | 本地存储迁移 | Web 端用 `localStorage`；Capacitor 端逐步迁移到 `@capacitor/preferences` 或安全存储插件 |
| 9 | 推送通知 | 集成 `@capacitor/push-notifications` + Firebase Cloud Messaging |
| 10 | 上架准备 | 配置应用图标、启动屏、权限说明、隐私政策、应用签名 |

#### 3.4.2 Capacitor 配置示例（`frontend/capacitor.config.ts`）

```ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.asdapp.family',
  appName: '孤独症支持平台',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#faf8f5',
    },
  },
};

export default config;
```

### 3.5 必须解决的关键问题

| 问题 | 当前状态 | 推荐处理 |
|------|----------|----------|
| **后端部署** | 目前仅本地 `localhost:3001` | 必须将 `server/` 部署到云服务器/Render/Firebase Functions，并配置 HTTPS 域名 |
| **API 跨域** | 开发时用 Vite proxy | 生产环境配置 CORS 白名单，只允许 APP/Web 域名 |
| **JWT Secret** | 当前 fallback 为硬编码字符串 | 生产环境必须设置强随机 `JWT_SECRET`，并定期轮换 |
| **用户数据文件** | `server/users.json` 本地文件 | 生产环境应迁移到 Firestore 或 PostgreSQL，避免多实例状态不一致 |
| **Token 存储** | Web 用 `localStorage` | APP 端用 Capacitor 安全存储；Web 端可保留 localStorage 但需 XSS 防护 |
| **离线体验** | 无 Service Worker | PWA 阶段实现资源缓存；AI 对话无法离线，但页面骨架可缓存 |
| **推送通知** | 无 | 未来用 FCM + Capacitor push 插件实现社区回复/关心提醒 |
| **应用商店合规** | 无 | 医疗/健康类 APP 需明确免责声明、隐私政策、未成年人保护说明 |

### 3.6 任务二优先级建议

| 优先级 | 事项 | 预计工期 |
|--------|------|----------|
| P0 | 响应式布局修复（`px-[80px]` 等） | 2–3 天 |
| P0 | PWA 基础改造（manifest、icons、Service Worker） | 3–5 天 |
| P1 | 后端部署到 HTTPS 域名 + 环境变量加固 | 3–7 天 |
| P1 | Capacitor 初始化与 iOS/Android 构建 | 5–7 天 |
| P2 | 原生能力接入（推送、安全存储、相机/相册） | 1–2 周 |
| P2 | 应用商店上架材料（图标、启动屏、隐私政策、免责声明） | 1–2 周 |
| P3 | 离线缓存策略优化与性能监控 | 1 周 |

---

## 4. 综合实施计划

### 4.1 第一阶段：安全加固（2–3 周）

1. 固定 Prompt 强化医疗免责声明与拒绝条款。
2. 输入/输出基础校验、速率限制上线。
3. 安全策略层（关键词过滤 + 拒绝文案）上线。
4. 补充安全事件日志。

### 4.2 第二阶段：移动化基础（2–3 周）

1. 修复响应式布局，适配手机。
2. 完成 PWA 改造。
3. 后端部署到生产域名，配置 HTTPS 与 CORS。
4. 加固 JWT Secret 与用户数据存储方案。

### 4.3 第三阶段：APP 上架（3–4 周）

1. Capacitor 集成 iOS/Android。
2. 接入推送通知、安全存储。
3. 准备应用商店素材与合规文档。
4. 内测、上架。

### 4.4 第四阶段：进阶优化（按需）

1. 结构化引用与来源卡片。
2. LLM-as-Judge 安全判断。
3. 审计日志可视化后台。
4. 离线 AI 问答（本地小模型，成本较高，远期考虑）。

---

## 5. 新增/修改文件总览

### 5.1 AI 安全相关

- 修改：`server/fixedSystemPrompt.js`
- 修改：`server/reflectSystemPrompt.js`（如需要追加引用约束）
- 修改：`server/index.js`
- 修改：`server/reflect.js`
- 修改：`frontend/src/pages/AiChat/AiChat.jsx`
- 新增：`server/inputGuard.js`
- 新增：`server/outputGuard.js`
- 新增：`server/safetyPolicy.js`
- 新增：`server/safetyGuard.js`
- 新增：`server/citationValidator.js`
- 新增：`server/auditLogger.js`
- 新增：`server/safetyLogger.js`
- 新增：`server/rateLimiter.js`

### 5.2 网站转 APP 相关

- 修改：`frontend/vite.config.js`
- 修改：`frontend/index.html`
- 修改：`frontend/package.json`
- 修改：`frontend/src/App.jsx`（如需要平台判断）
- 修改：`frontend/src/style.css`（safe area、响应式边距）
- 修改：`frontend/src/components/common/BottomNav.jsx`（底部安全区）
- 新增：`frontend/public/manifest.json`
- 新增：`frontend/public/icons/*.png`
- 新增：`frontend/capacitor.config.ts`
- 新增：`frontend/src/utils/platform.js`（平台判断）
- 新增：`ios/`、`android/`（由 Capacitor 生成）

---

## 6. 风险与注意事项

1. **医疗合规风险**：AI 提供建议必须始终附带「非诊断、非医疗建议」声明；涉及诊断/用药必须引导就医。
2. **数据隐私风险**：用户聊天记录、长期记忆、社交动态需按用户隔离；生产环境必须 HTTPS、加密存储。
3. **模型幻觉风险**：引用溯源只能降低不能根除；对高医疗风险问题应限制回答范围或拒绝回答。
4. **应用商店审核风险**：健康/医疗类 APP 审核严格，需准备充分免责声明、隐私政策、资质说明。
5. **成本风险**：增加 LLM-as-Judge、引用校验、reflect 调用会显著增加 token 消耗，需设置预算监控与熔断。

---

## 7. 参考来源

- [LLM Guardrails: Strategies & Best Practices in 2025](https://leanware.co/insights/llm-guardrails)
- [What guardrails are essential for LLM-powered healthcare applications?](https://milvus.io/ai-quick-reference/what-guardrails-are-essential-for-llmpowered-healthcare-applications)
- [GenAI in Medical Affairs: Use Cases & Compliance Guardrails](https://intuitionlabs.ai/articles/genai-medical-affairs-compliance)
- [How well do LLMs cite relevant medical references?](https://arxiv.org/html/2402.02008v1)
- [An automated framework for assessing how well LLMs cite relevant medical references](https://www.nature.com/articles/s41467-025-58551-6)
- [Capacitor by Ionic - Cross-platform apps with web technology](https://capacitorjs.com/)
- [Transform Your PWA to a Native App with Capacitor](https://capgo.app/blog/transform-pwa-to-native-app-with-capacitor/)
- [Progressive Web to Native Mobile with Capacitor](https://without.systems/progressive-web-to-native-mobile-with-capacitor)
