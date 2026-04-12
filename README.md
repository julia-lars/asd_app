# 孤独症支持平台 (asd_app)

## 项目概述

孤独症支持平台是一个为孤独症患者及其家庭提供支持和资源的综合性应用。该平台旨在通过提供信息、社区互动和专业支持，帮助用户更好地了解和应对孤独症。

## 项目结构

```
asd_app/
├── server/                      # AI 网关（Express + MCP 子进程调用 DeepSeek）
│   ├── index.js                 # HTTP 服务：/api/ai/chat 等
│   ├── fixedSystemPrompt.js     # 固定系统 Prompt（全站统一，见下文）
│   ├── package.json
│   └── .env.example             # 环境变量示例（复制为 .env）
├── frontend/                    # 前端项目
│   ├── public/                  # 静态资源
│   │   ├── background.png       # 背景图片
│   │   ├── bulletin_board_1.jpg # 公告板图片1
│   │   ├── bulletin_board_2.jpg # 公告板图片2
│   │   ├── bulletin_board_3.jpg # 公告板图片3
│   │   └── vite.svg             # Vite默认图标
│   ├── src/                     # 源代码
│   │   ├── components/          # 可复用组件
│   │   │   └── common/          # 通用组件
│   │   │       ├── BottomNav.jsx    # 底部导航栏
│   │   │       └── ImageCarousel.jsx # 图片轮播组件
│   │   ├── contexts/            # 全局上下文
│   │   │   └── AuthContext.jsx  # 认证上下文
│   │   ├── pages/               # 页面组件
│   │   │   ├── AiChat/          # AI对话页面
│   │   │   │   └── AiChat.jsx   # AI对话组件
│   │   │   ├── Auth/            # 认证相关页面
│   │   │   │   ├── Login.jsx    # 登录页面
│   │   │   │   └── Register.jsx # 注册页面
│   │   │   ├── Help/            # 帮助中心页面
│   │   │   │   └── Help.jsx     # 帮助中心组件
│   │   │   ├── Profile/         # 个人资料页面
│   │   │   │   └── Profile.jsx  # 个人资料组件
│   │   │   └── Social/          # 社交平台页面
│   │   │       └── Social.jsx   # 社交平台组件
│   │   ├── services/            # 服务层
│   │   │   └── firebase.js      # Firebase配置
│   │   ├── App.jsx              # 应用主组件
│   │   ├── main.jsx             # 应用入口
│   │   ├── main.ts              # TypeScript入口
│   │   └── style.css            # 全局样式
│   ├── .gitignore               # Git忽略文件
│   ├── index.html               # HTML模板
│   ├── package-lock.json        # 依赖锁定文件
│   ├── package.json             # 前端依赖
│   ├── vite.config.js           # Vite 配置（开发时把 /api 代理到后端）
│   ├── postcss.config.js        # PostCSS配置
│   ├── tailwind.config.js       # Tailwind CSS配置
│   └── tsconfig.json            # TypeScript配置
└── README.md                    # 项目说明
```

## 功能模块

### 1. 认证系统
- **登录功能**：用户可以通过邮箱和密码登录
- **注册功能**：新用户可以创建账号
- **身份验证**：使用Firebase Authentication进行身份验证

### 2. 社交平台
- **动态发布**：用户可以发布文本动态
- **动态列表**：展示所有用户的动态，按时间倒序排列
- **图片展示**：顶部展示公告板图片

### 3. AI对话
- **智能问答**：通过本地后端调用 **DeepSeek**（经 **MCP** 子进程 `deepseek-mcp-server`），用户可与 AI 进行关于孤独症等方面的问答
- **系统 Prompt**：由服务端 **`server/fixedSystemPrompt.js`** 统一注入（详见下文「AI 助手：接入 DeepSeek 与 Prompt」）；前端对话页不再提供 Prompt 编辑区

### 4. 帮助中心
- **常见问题**：提供孤独症相关的常见问题解答
- **资源链接**：提供专业的孤独症相关资源和支持机构的链接
- **联系我们**：提供联系方式，方便用户咨询

### 5. 个人资料
- **用户信息**：展示用户的基本信息
- **个人设置**：允许用户修改个人资料

## 技术栈

### 前端技术
- **React 19.2.4**：用于构建用户界面的JavaScript库
- **React Router 7.13.1**：用于页面路由管理
- **Firebase 12.10.0**：用于身份验证和数据存储
- **Tailwind CSS 4.2.1**：用于快速构建响应式界面
- **TypeScript**：提供类型安全
- **Vite**：现代前端构建工具

### 后端技术
- **Firebase**：用户认证（Authentication）、社交动态等（Firestore）
- **Node 服务 `server/`**：AI 助手专用网关，使用 `@modelcontextprotocol/sdk` 以 **stdio** 方式启动本地依赖包 **`deepseek-mcp-server`**，通过 MCP 工具 **`chat_completion`** 调用 DeepSeek 官方 API（不把 API Key 暴露给浏览器）

## 安装和运行

### 前置要求
- **Node.js**：建议 **20+**（`deepseek-mcp-server` 要求 Node ≥ 20；前端构建一般 18+ 也可）
- **npm** 7.0 或更高版本
- **Firebase 项目**：在 `frontend/src/services/firebase.js` 中配置
- **DeepSeek API Key**（仅在使用 AI 助手时需要）：在 [DeepSeek 开放平台](https://platform.deepseek.com/) 创建密钥

### 安装步骤

1. 克隆项目
```bash
git clone <repository-url>
cd asd_app
```

2. 安装前端依赖
```bash
cd frontend
npm install
```

3. 安装 AI 网关依赖
```bash
cd ../server
npm install
```

4. 配置 Firebase
- 在 Firebase 控制台创建项目
- 启用 Authentication 和 Firestore
- 将配置写入 `frontend/src/services/firebase.js`

5. 配置 DeepSeek（使用 AI 助手时必填）  
见下一节 **「AI 助手：接入 DeepSeek 与 Prompt」**；简要步骤：复制 `server/.env.example` 为 `server/.env`，填入 `DEEPSEEK_API_KEY`。

6. 本地同时启动后端与前端（需要两个终端）

终端 A（AI 网关，默认端口 **3001**）：
```bash
cd server
node index.js
```

终端 B（前端，默认 **5173**，并把 `/api` 代理到 3001）：
```bash
cd frontend
npm run dev
```

浏览器访问：**http://localhost:5173/** ，进入底部导航 **「AI 助手」**。

7. 仅构建前端生产包（不包含 `server` 部署说明时）
```bash
cd frontend
npm run build
```

---

## AI 助手：接入 DeepSeek 与 Prompt

本节说明 **DeepSeek 如何接入**、**Prompt 写在哪里**、以及 **请求链路**。

### 架构与数据流（简要）

1. 用户在浏览器打开 AI 助手页（`frontend/src/pages/AiChat/AiChat.jsx`）。
2. 前端通过 **`fetch('/api/ai/chat', …)`** 发请求（开发环境下由 `frontend/vite.config.js` 把 **`/api` 代理到 `http://localhost:3001`**）。
3. **`server/index.js`**（Express）收到请求后，使用 **`@modelcontextprotocol/sdk`** 的 **MCP 客户端**，以 **stdio** 方式启动本机已安装的 **`deepseek-mcp-server`**（入口在 `server/node_modules/deepseek-mcp-server/build/index.js`）。
4. MCP 服务端注册的工具 **`chat_completion`** 被调用，内部由 `deepseek-mcp-server` 请求 **DeepSeek 官方 Chat Completions API**。
5. 模型回复经 MCP 返回 JSON，再经 Express 回传给前端展示。

这样 **API Key 只存在于服务器环境变量**，不会出现在前端代码或打包产物中。

### 第一步：配置 DeepSeek API Key

1. 登录 [DeepSeek 开放平台](https://platform.deepseek.com/)，创建 **API Key**。
2. 在仓库中复制环境变量模板：
```bash
cp server/.env.example server/.env
```
3. 编辑 **`server/.env`**，至少设置：
```bash
DEEPSEEK_API_KEY="你的密钥"
```
4. （可选）同一文件中还可设置：
   - **`PORT`**：网关端口，默认 `3001`（需与 Vite 代理一致）。
   - **`DEEPSEEK_MODEL`**：模型名，默认 `deepseek-chat`。

5. **重启** `node index.js` 后配置才会生效。若未配置 Key，后端会告警，且调用 `/api/ai/chat` 会返回错误提示。

### 第二步：确认本地同时跑了两个进程

| 进程 | 目录 | 命令 | 默认地址 |
|------|------|------|----------|
| AI 网关 | `server/` | `node index.js` | http://localhost:3001 |
| 前端 | `frontend/` | `npm run dev` | http://localhost:5173 |

只开前端、不开网关时，AI 助手发消息会失败（无法代理到 `/api`）。

### Prompt 写在哪里？

当前产品内 **仅保留服务端固定 Prompt**：在 **`server/fixedSystemPrompt.js`** 中编辑常量 **`FIXED_SYSTEM_PROMPT`**，改完后 **重启** `server` 进程生效。

**拼接规则**（在 **`server/index.js`** 中实现）：若 `FIXED_SYSTEM_PROMPT` 非空，则作为 **system** 消息与用户当前输入一并发给 DeepSeek；若为空，则只发用户消息。

**可选**：接口 **`POST /api/ai/chat`** 仍支持 JSON 字段 **`systemPrompt`**（字符串，可省略）。若传入，会接在固定 Prompt 之后、合并为一条 system（供脚本或其它客户端使用）；**前端 AI 助手页已不再展示该字段的输入框**。

### 接口说明（供联调）

- **`POST /api/ai/chat`**  
  - Body（JSON）：`{ "message": "用户当前输入", "systemPrompt": "可选，补充 system 文案，可省略" }`  
  - 成功：`{ "text": "模型回复正文" }`  
  - 失败：HTTP 4xx/5xx，body 含 `error` 字段。

### 常见问题

- **页面能开，一发消息就报错**：检查是否已配置 **`DEEPSEEK_API_KEY`**、**`server` 是否在跑**、前端 **`npm run dev`** 是否使用了带 `/api` 代理的 `vite.config.js`。
- **想改「所有人统一的底线规则」**：改 **`server/fixedSystemPrompt.js`**，并重启 `server`。
- **需要按用户/场景动态补充 system**：可自建客户端调用 **`POST /api/ai/chat`** 并传入 **`systemPrompt`**，或在服务端扩展逻辑。

---

## AI 助手（规划）：对话要点摘要、照顾者状态与下一轮关心

本节描述一项**尚未实现**的产品能力，并给出**完整技术路径**，便于后续排期与评审。

### 可行性结论

**可以实现。** 做法是：在每次「用户提问 → 模型主回复」完成之后，**再发起一次**经 MCP（仍为 `deepseek-mcp-server` 的 **`chat_completion`**）的调用，专门做**结构化归纳**；把归纳结果存成**会话级状态**，在下一次主对话请求前，把该状态以**额外的 system 片段**或**服务端组装的关心话术**注入，从而让模型在开口前先对用户表达关心。

需要注意：**「照顾者状态」由模型推断，不是临床评估**，必须在产品与文案中明确免责，并控制幻觉与过度推断风险（见下文「合规与安全」）。

### 目标行为（产品定义）

1. **回合结束后的第二次 MCP 调用**  
   输入：本轮（或最近滑动窗口内）的 user/assistant 对话文本。  
   输出（建议结构化）：  
   - **对话要点**：3～7 条简短 bullet，便于后续上下文压缩。  
   - **照顾者状态推断**：仅允许「支持性、非诊断」标签或短句，例如：疲惫度高、焦虑明显、寻求具体建议、情绪低落、信息不足等（具体枚举由 Prompt 与 JSON Schema 约束）。  
   - **可选：下一轮关心建议**：一句不超过固定字数的「关心话术」草稿（也可改由第三次专门调用生成，见下文）。

2. **下一次主对话前**  
   服务端在拼 **`FIXED_SYSTEM_PROMPT`** 时，追加一块**动态上下文**，例如：  
   - `上一轮摘要：…`  
   - `对照顾者状态的观察（非诊断）：…`  
   - `请先自然表达一句关心，再回答用户本轮问题。`  
   或：由服务端生成一句固定模板的关心语，作为**首条 assistant 可见消息**（需权衡是否打断对话流）。

### 推荐技术路径（按实现顺序）

#### 1. 会话与数据模型

- **会话 ID**：与现有 Firebase `user.uid` 结合，生成 `conversationId`（UUID 或「用户 + 当日」策略）。前端每次打开 AI 助手或点击「新对话」时申请/切换 `conversationId`。  
- **服务端存储（推荐）**：  
  - **MVP**：进程内 `Map<conversationId, state>`（重启丢失，仅本地开发）。  
  - **产品化**：**Firestore**（与现有栈一致）文档字段如：`summaryBullets[]`、`caregiverSignals[]`、`lastReflectAt`、`rollingTranscriptHash`、`careSnippet`（上一轮生成的关心短句）。  
- **状态版本**：字段加 `schemaVersion`，便于以后改 Prompt/JSON 结构时做迁移。

#### 2. API 设计（扩展现有网关）

在 **`server/index.js`** 上演进（名称示例）：

| 接口 | 作用 |
|------|------|
| `POST /api/ai/chat`（现有） | 主对话；Body 增加可选 `conversationId`；服务端在拼 system 时**附加**上一步存好的 `summary + caregiverSignals + 关心指令**。 |
| `POST /api/ai/reflect`（新） | **回合后**调用：Body 含 `conversationId`、本轮 `messages` 片段或 `turnId`；内部第二次 `callTool('chat_completion', …)`，使用**独立固定 Prompt**（如 `server/reflectSystemPrompt.js`），要求 **JSON 输出**（`response_format` 或 Prompt 内约定 + 服务端解析校验）。 |
| （可选）`GET /api/ai/session/:id` | 调试或前端展示「本轮摘要」卡片。 |

**调用顺序（服务端编排）**：

1. 收到用户新消息 → 调 MCP **主对话** → 返回 assistant 正文给前端。  
2. **异步**（推荐）或同步：用「本轮 user + assistant」调 **`/api/ai/reflect` 同源逻辑**（不要在 Express 里 HTTP 自调用，直接抽函数 `runReflect(...)`），更新 Firestore / 内存状态。  
3. 用户发**下一条**时，`/api/ai/chat` 读取该状态，注入 system。

**异步 vs 同步**：异步可缩短用户首字等待时间，但存在「用户极快连发第二条时状态尚未写好」的竞态，需用 `turnId` 或队列串行化 per `conversationId`。

#### 3. 第二次 MCP 调用（归纳与状态）

- **仍通过现有 MCP 客户端**，工具名仍为 **`chat_completion`**。  
- **与主对话区分**：  
  - 使用**另一段 system Prompt**（仅服务端，可新建 `server/reflectSystemPrompt.js`），明确：只做摘要与照顾者**情绪/处境**推断，禁止诊断、禁止医疗建议，输出 **严格 JSON**。  
  - 可选用 **较小/较快模型**（若 DeepSeek 账号支持多模型，通过 `DEEPSEEK_REFLECT_MODEL` 环境变量切换）。  
- **输入上下文长度**：不要每次送全量历史；送「滑动窗口」如最近 N 轮或最近 M 字符，并可选附带**上一轮已存的 summary** 做增量更新（减少 token）。

#### 4. 「下一轮关心」的生成策略（两种选一或组合）

- **策略 A（推荐 MVP）**：在 **reflect** 的 JSON 里直接产出 `care_opener` 一句；下次 `chat` 时在 system 里写：`上一轮结束后建议的开场关心：「…」` 并要求模型自然融入首段。  
- **策略 B**：reflect 只产出状态标签；**第三次** MCP 调用专门生成关心句（成本更高，语气更可控）。  

#### 5. 前端（`AiChat.jsx`）改造要点

- 维护 **`conversationId`**，与每条消息一并提交或在首条消息时由后端返回。  
- UI 可选：**折叠区展示「本轮要点」**（需信任模型摘要，默认可关闭）。  
- 加载态：若 reflect 异步，主回复先出，摘要稍后在 UI 更新（WebSocket/SSE 或轮询 `GET session`，MVP 可仅服务端存、下轮再显式体现关心）。

#### 6. 合规与安全

- **文案与固定 Prompt**：反复强调非医疗、非诊断；状态仅为**支持性对话辅助**。  
- **敏感内容**：摘要与状态不落日志明文，或脱敏；Firestore 规则按 `userId` 隔离。  
- **护栏**：对 JSON 解析失败、字段缺失、超时，降级为「不注入状态」，主对话仍可用。  
- **人工审核（远期）**：若上线社区化功能，再考虑是否展示「模型推断状态」给其他用户（当前场景仅本人可见即可）。

#### 7. 成本与体验

- 每轮多 **1 次**（或 2 次）API 调用：需监控 token 与延迟；reflect 可用更短 max_tokens、更低 temperature。  
- **失败重试**：reflect 失败不应阻塞主流程。

### 小结

| 环节 | 要点 |
|------|------|
| 是否可能 | 可能；复用现有 MCP + `chat_completion`，增加「归纳」专用 Prompt 与存储。 |
| 核心增量 | `reflect` 逻辑、会话状态存储、`/api/ai/chat` 动态 system 注入、前端 `conversationId` 与可选展示。 |
| 风险 | 模型推断非真实心理状态；需免责、降级与 JSON 校验。 |

---

## 图片显示功能使用说明

### 更换图片
1. 打开`public`文件夹
2. 替换现有的`bulletin_board_1.jpg`文件
3. 保持文件名不变，直接替换图片内容即可

### 调整图片显示设置
1. 打开`src/pages/Social/Social.jsx`文件
2. 修改图片相关的代码：
   - `src`：修改图片路径
   - `alt`：修改图片描述
   - `className`：调整图片样式

### 示例配置
```jsx
<img 
  src="/bulletin_board_1.jpg" 
  alt="公告板图片" 
  className="max-w-full max-h-full object-contain"
  onError={(e) => {
    console.error('图片加载失败:', e.target.src);
    e.target.src = 'https://via.placeholder.com/800x300?text=图片加载失败';
  }}
/>
```

## 功能使用指南

### 1. 登录/注册
- 访问`/login`页面进行登录
- 访问`/register`页面进行注册
- 登录后会自动跳转到社交平台页面

### 2. 社交平台
- 在文本框中输入内容，点击"发布"按钮发布动态
- 浏览其他用户发布的动态
- 查看顶部的图片

### 3. AI对话
- 访问 `/ai-chat` 页面
- 在底部输入框输入问题并发送；系统 Prompt 由服务端 `server/fixedSystemPrompt.js` 统一注入（详见上文「AI 助手：接入 DeepSeek 与 Prompt」）
- 需本地已启动 `server` 且配置 `DEEPSEEK_API_KEY`
- 等待模型回复

### 4. 帮助中心
- 访问`/help`页面
- 查看常见问题、资源链接和联系信息

### 5. 个人资料
- 访问`/profile`页面
- 查看和修改个人信息

## 项目亮点

1. **响应式设计**：适配不同屏幕尺寸
2. **图片显示**：提供视觉吸引力强的图片展示
3. **Firebase集成**：使用Firebase提供的服务，简化后端开发
4. **模块化结构**：代码组织清晰，易于维护和扩展
5. **AI集成**：提供智能问答功能，增强用户体验

## 未来计划

1. 总体 网页风格设计

2. 社交平台
- 在文本框中输入内容，点击"发布"按钮发布动态;添加图片和特定表情
- 增强社区互动功能，如评论和点赞
- 轮播内容：孤独症相关节日、大事件

3. AI对话
- 接入现有知识库，进行rag检索后回答问题
- 加入专有prompt，比如让ai语气更舒缓更友好，同理心更强等内容
- 增加更多AI功能，如情绪识别和行为分析

4. 帮助中心
- 相关专家、医生资料卡片
- 知识图谱相关
- 可能提供的志愿服务
- 查看常见问题、资源链接和联系信息

5. 个人资料
- 可以建立成长等级，记录对社区的贡献之类？
- 加入城市、电话、患者情况等信息，方便交流
---

© 2026 孤独症支持平台