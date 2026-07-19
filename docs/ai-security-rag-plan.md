# 孤独症支持平台：AI 安全机制 + 知识图谱 RAG 调研与修改计划

> 生成日期：2026-07-15  
> 基于仓库版本：main 分支当前代码  
> 替代旧文档：`docs/security-and-app-plan.md`（已作废）

---

## 1. 任务背景与项目现状

### 1.1 项目结构

当前 `asd_app` 是一个面向孤独症患者家属的 Web 应用，技术栈为：

- **前端**：React 19 + Vite 7 + Tailwind CSS 4 + React Router 7
- **后端**：Express 5 + MCP（`deepseek-mcp-server`）调用 DeepSeek API
- **数据/认证**：Firebase Firestore（社交动态）+ 自建 JWT 用户体系（`server/users.json`）
- **AI 特性**：服务端固定 Prompt + 每轮对话后的 reflect（长期记忆归纳）
- **知识图谱**：由 `public/match-autism-spectrum-disorder.cx` 经 `scripts/cxToKgGraph.mjs` 生成 `src/data/kg-graph.json`，共 420 个节点、1232 条边

关键文件：

| 模块 | 文件 |
|------|------|
| AI 对话后端 | `server/index.js`、`server/fixedSystemPrompt.js`、`server/reflect.js`、`server/reflectSystemPrompt.js`、`server/longTermMemory.js` |
| AI 对话前端 | `frontend/src/pages/AiChat/AiChat.jsx` |
| 知识图谱 | `frontend/src/pages/Help/KnowledgeGraphPage.jsx`、`frontend/src/data/kg-graph.json`、`frontend/scripts/cxToKgGraph.mjs`、`frontend/public/match-autism-spectrum-disorder.cx` |
| 社交/社区 | `frontend/src/pages/Social/Social.jsx` |
| 认证 | `frontend/src/contexts/AuthContext.jsx`、`server/index.js` |

### 1.2 本次待解决问题

1. **AI 安全性**：在现有 DeepSeek 对话链路中建立**引用溯源**、**约束校验**、**拒绝不当请求**的机制。
2. **知识图谱 RAG**：利用仓库中已有的知识图谱，为 AI 对话增加检索增强生成（RAG），并在 RAG 检索结果中**标注内容来源**。

**注意**：原「从网站跨越到 APP」任务已取消，本计划不再涉及移动端改造。

---

## 2. 知识图谱现状与可用性分析

### 2.1 数据结构

当前 `kg-graph.json` 中的元素：

- **节点**：`{ id, label, rawId, typeTag, color }`
  - `label`：概念名称（如「先天性异常」、「布美他尼」）
  - `typeTag`：UMLS 语义类型缩写（如 `cgab` 先天性异常、`orch` 有机化学品、`topp` 治疗性操作）
- **边**：`{ id, source, target, label }`
  - `label`：关系类型（如「治疗」、「是……的过程」、「与……共存」）

### 2.2 缺失：来源元数据

原始 CX 文件中的 `edgeAttributes` 包含更完整的自然语言描述（如「先天性异常 (与……共存) 孤独症谱系障碍」），但当前 `cxToKgGraph.mjs` **没有**将其导出到 JSON。此外，CX 中**没有**直接携带文献来源、PMID、DOI、置信度等字段。

这意味着：

- 知识图谱可作为 RAG 的「结构化事实库」。
- 但目前**无法精确追溯到某一篇论文或指南**。
- 需要在 CX 层或转换脚本层补充来源字段，才能实现真正的引用溯源。

### 2.3 对 RAG 的适用性

| 能力 | 当前状态 | 评估 |
|------|----------|------|
| 概念/实体检索 | ✅ 节点标签可直接匹配 | 适合 |
| 关系检索 | ⚠️ 仅关系类型，缺少完整语义句 | 需增强 |
| 多跳推理 | ⚠️ 图结构存在，但未在服务端加载 | 需开发 |
| 来源追溯 | ❌ 无 PMID/DOI/文献字段 | 需补充 |
| 置信度/证据等级 | ❌ 无 | 远期补充 |

---

## 3. 总体架构设计

### 3.1 目标架构

```
用户提问
    │
    ▼
┌─────────────────┐
│  输入安全校验层   │  ← 长度、敏感词、Prompt 注入、速率限制
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  安全判断层      │  ← 策略词库 + LLM-as-Judge（可选）
└─────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│  知识图谱 RAG 检索层                │
│  - 加载 kg-graph.json               │
│  - 关键词匹配 + 邻居扩展             │
│  - 生成自然语言证据片段              │
│  - 附带来源信息（节点/边/图谱/外部） │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│  主模型调用（DeepSeek）              │
│  - system prompt 注入检索到的证据    │
│  - 要求模型仅基于证据回答并标注来源  │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────┐
│  输出校验层      │  ← 长度、格式、免责声明、引用校验
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  引用溯源/展示   │  ← 前端 source chips + 来源说明
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  审计日志        │  ← traceId / query / evidence / output / citations
└─────────────────┘
```

### 3.2 设计原则

1. **可解释性**：每个医学/事实性回答都应能追溯到知识图谱中的节点、边或外部来源。
2. **失败降级**：RAG 检索不到时不阻塞对话，模型基于自身知识回答，但标记为「未引用图谱」。
3. **安全优先**：输入/输出安全层在 RAG 之前运行，拒绝不当请求不触发检索。
4. **低成本**：优先使用内存索引，不引入额外向量数据库或 Embedding 服务。
5. **可扩展**：CX 格式预留来源字段后，可逐步替换为带 PMID/DOI 的精确引用。

---

## 4. 任务一：知识图谱 RAG（含来源标注）

### 4.1 推荐方案

采用 **「内存关键词检索 + 图邻居扩展 + 自然语言证据片段 + 结构化来源标注」** 的轻量 RAG。

#### 4.1.1 步骤 1：扩展知识图谱来源信息

**方案 A（推荐 MVP）**：
- 在 `cxToKgGraph.mjs` 中读取 CX 的 `edgeAttributes['name']`，将其作为每条边的完整语义描述存入 `kg-graph.json`。
- 为每条边增加一个 `provenance` 字段，默认值为 `"平台知识图谱（基于期刊文献构建）"`。
- 如果团队能在 CX 中补充 `source_pmid`、`source_doi`、`source_title`、`evidence_level` 等字段，则同步导出到 JSON。

**方案 B（远期）**：
- 维护一个独立的 `kg-sources.json` 文件，按 `rawId` 或 `edgeId` 映射到文献来源。
- 通过 UMLS / PubMed API 对高频节点自动补全 PMID。

#### 4.1.2 步骤 2：服务端构建 RAG 索引

新增 `server/kgRag.js`：

1. **启动时加载** `frontend/src/data/kg-graph.json`（或独立拷贝到 `server/data/kg-graph.json`）。
2. **构建倒排索引**：
   - 对节点 `label`、边 `label`、边完整描述分词（中文按字/词，英文按空格）。
   - 建立 `term → [nodeIds / edgeIds]` 映射。
3. **检索逻辑**：
   - 对用户 query 分词，查询倒排索引。
   - 对命中的节点，扩展其一阶邻居（节点 + 边）。
   - 对命中的边，直接返回两端节点 + 边。
   - 按覆盖度排序，取 Top-K（如 K=5–10 条边）。
4. **生成证据片段**：
   - 将每条检索到的边转换为自然语言：
     - `"先天性异常" 与 "孤独症谱系障碍" 存在共存关系（来源：平台知识图谱）`
     - `"布美他尼" 可用于 "治疗" "行为症状"（来源：平台知识图谱）`
   - 同时保留结构化数据：`{ sourceNode, relation, targetNode, provenance }`。

#### 4.1.3 步骤 3：与主对话链路集成

在 `server/index.js` 的 `/api/ai/chat` 中：

1. 用户消息通过安全层后，调用 `retrieveEvidence(query, locale)`。
2. 若检索到证据：
   - 将证据片段拼入 system prompt：
     ```
     以下是平台知识图谱中检索到的相关事实，请优先基于这些事实回答，并在回答中标注来源。
     若知识图谱信息与用户问题无关，请说明「未在知识图谱中找到直接相关信息」。

     【证据片段】
     1. 先天性异常 与 孤独症谱系障碍 存在共存关系（来源：平台知识图谱）
     2. 布美他尼 治疗 行为症状（来源：平台知识图谱）
     ```
3. 若未检索到证据：
   - 在 system prompt 中说明「未检索到知识图谱相关内容」，让模型基于自身知识谨慎回答。

#### 4.1.4 步骤 4：回答中的来源标注

- 要求模型在回答中以 `〔来源：平台知识图谱：节点A —关系→ 节点B〕` 的形式标注。
- 服务端用 `citationValidator.js` 提取并校验这些标注。
- 前端将标注渲染为可点击 chips，点击后展示：
  - 节点/边名称
  - 关系描述
  - 来源说明（当前为「平台知识图谱」；未来可展示具体文献）
  - 免责声明

### 4.2 实施步骤

| 步骤 | 文件 | 改动要点 |
|------|------|----------|
| 1 | `frontend/scripts/cxToKgGraph.mjs` | 读取 `edgeAttributes['name']`，输出边的完整描述；为边增加 `provenance` 字段 |
| 2 | `frontend/package.json` | 重新运行 `npm run build:kg`，更新 `kg-graph.json` |
| 3 | 新增 `server/data/kg-graph.json` | 将生成后的图谱拷贝或软链接到后端目录（或通过构建脚本同步） |
| 4 | 新增 `server/kgRag.js` | 加载图谱、构建倒排索引、实现 `retrieveEvidence(query, options)` |
| 5 | 新增 `server/ragPromptBuilder.js` | 将证据片段格式化为 system prompt 片段 |
| 6 | `server/fixedSystemPrompt.js` | 追加 RAG 使用规则：优先基于证据、标注来源、无法确认时 disclaimer |
| 7 | `server/index.js` | 在 `/api/ai/chat` 中调用 RAG 检索，将证据拼入 system prompt；返回 `retrievedEvidence` |
| 8 | `server/citationValidator.js` | 校验模型回答中的 RAG 引用格式，标记可疑引用 |
| 9 | `frontend/src/pages/AiChat/AiChat.jsx` | 渲染证据来源 chips；展示「本次回答基于知识图谱」/「未引用图谱」状态 |
| 10 | 测试 | 构造与图谱相关的问题（如「布美他尼」）、无关问题、诱导性问题，验证 RAG 行为 |

### 4.3 关键设计细节

#### 4.3.1 检索质量优化

- **同义词扩展**：维护一个孤独症相关同义词表（如「自闭症」→「孤独症谱系障碍」、「ASD」→「孤独症谱系障碍」）。
- **停用词过滤**：过滤「的」、「是」、「什么」、「怎么」等无意义词。
- **邻居扩展策略**：
  - 对命中节点扩展 1 阶邻居（默认）。
  - 若 1 阶邻居过多，优先保留关系为「治疗」、「诊断」、「与……共存」、「影响」的边。
- **相关性打分**：
  - query 词在节点/边中的命中次数。
  - 节点度数（连接数）作为次要权重。

#### 4.3.2 与现有 reflect 的协同

- RAG 检索只在**主对话**时发生， reflect（长期记忆归纳）不需要检索。
- reflect 仍可记录用户提到的医学实体，但不应将其作为诊断依据。

#### 4.3.3 来源标注格式

推荐前端展示格式：

```
AI 回答正文……〔来源：知识图谱〕

来源：
• 布美他尼 — 治疗 → 行为症状（平台知识图谱）
• 先天性异常 — 与……共存 → 孤独症谱系障碍（平台知识图谱）
```

当 CX 补充 PMID/DOI 后，可升级为：

```
• 布美他尼 — 治疗 → 行为症状（Lemon et al., 2020; PMID: 12345678）
```

---

## 5. 任务二：AI 安全性三机制

### 5.1 现状梳理

#### 5.1.1 已有基础

- `server/fixedSystemPrompt.js` 已要求模型：
  - 语气温和、不做医疗诊断
  - 回答简短、不要加粗 Markdown
  - 引用可信来源，不要编造 DOI/PMID
- `server/reflectSystemPrompt.js` 要求 reflect 输出严格 JSON，且不做诊断。
- `server/index.js` 对请求参数做了基础校验。
- `server/reflect.js` 对 reflect 返回做了 JSON 解析与字段归一化。

#### 5.1.2 当前缺失

| 维度 | 现状 | 风险 |
|------|------|------|
| **引用溯源** | 仅靠 Prompt 软约束 | 模型可能编造来源；RAG 引入后若不加校验，来源标注会失真 |
| **约束校验** | 仅参数类型校验 | 有害/诱导请求可直达模型 |
| **拒绝不当请求** | 仅靠固定 Prompt | 对自伤、暴力、虐待、诱导诊断等无明确拒绝策略 |

### 5.2 目标一：引用溯源（Citation Traceability）

#### 5.2.1 推荐方案

与 RAG 来源标注共享基础设施：

1. **结构化引用 Prompt**  
   要求模型：
   - 基于 RAG 证据时：使用 `〔来源：知识图谱：节点A —关系→ 节点B〕`。
   - 基于一般知识时：使用 `〔来源：一般性医学知识〕` 或 `〔来源：CDC/WHO/AAP 等可信机构〕`。
   - 无法确认时：明确说「我无法确认具体来源」。

2. **引用校验器**（`server/citationValidator.js`）
   - 提取回答中的引用标记。
   - 校验引用是否存在于当前 RAG 检索到的证据中。
   - 校验外部引用域名是否在白名单。
   - 对无法校验的引用标记为「来源待核实」。

3. **前端来源卡片**  
   在 `AiChat.jsx` 中渲染来源 chips，点击展示详细说明与免责声明。

4. **审计日志**  
   记录每次对话的 traceId、用户 ID、检索到的证据、模型回答、引用列表。

### 5.3 目标二：约束校验（Constraint Validation）

#### 5.3.1 推荐方案

1. **输入层校验**
   - 消息长度上限（如 2000 字符）。
   - 策略关键词过滤器：自伤/自杀、暴力、虐待、极端歧视、Prompt 注入。
   - 限制/移除 `systemPrompt` 接口字段，避免 Prompt 覆盖。

2. **模型参数约束**
   - `max_tokens` 按场景动态调整。
   - reflect 使用低 temperature + 强制 JSON schema。

3. **输出层校验**
   - 长度截断、Markdown/URL 过滤、自动追加 disclaimer。
   - 对医疗相关内容校验是否包含 disclaimer。

4. **速率限制**
   - 按 `userId` 或 IP 限制请求频率。

### 5.4 目标三：拒绝不当请求（Refusal of Inappropriate Requests）

#### 5.4.1 推荐方案

1. **策略层（规则过滤）**  
   维护不当请求分类词库，命中直接返回固定拒绝文案。

2. **模型层（LLM-as-Judge）**  
   对策略层未命中但可疑的消息，用轻量模型做安全判断。

3. **固定 Prompt 强化**  
   明确列出拒绝事项：诊断、处方、自伤、暴力、虐待、歧视。

4. **安全事件日志**  
   记录拒绝事件，便于事后审查。

---

## 6. 综合实施计划

### 6.1 第一阶段：知识图谱 RAG MVP（2–3 周）

1. 扩展 `cxToKgGraph.mjs`，导出边的完整描述和 `provenance`。
2. 重新生成 `kg-graph.json`。
3. 新增 `server/kgRag.js`：内存倒排索引 + 检索 + 证据片段生成。
4. 修改 `server/index.js`：在 `/api/ai/chat` 中调用 RAG，将证据拼入 system prompt。
5. 修改 `server/fixedSystemPrompt.js`：追加 RAG 使用规则与来源标注规则。
6. 前端 `AiChat.jsx`：展示「基于知识图谱」状态和来源 chips。
7. 测试：相关查询、无关查询、边缘情况。

### 6.2 第二阶段：安全机制（2 周）

1. 固定 Prompt 强化医疗免责声明与拒绝条款。
2. 新增 `server/inputGuard.js` 和 `server/outputGuard.js`。
3. 新增 `server/safetyGuard.js` 与 `server/safetyPolicy.js`。
4. 新增 `server/rateLimiter.js`。
5. 新增 `server/citationValidator.js` 与 `server/auditLogger.js`。
6. 前端增加输入字数提示与温和的错误展示。

### 6.3 第三阶段：来源精化（远期，1–2 周）

1. 在 CX 中补充 `source_pmid`、`source_doi`、`source_title`、`evidence_level` 字段。
2. 更新 `cxToKgGraph.mjs` 导出这些字段。
3. 升级 RAG 证据片段与前端来源卡片，展示具体文献信息。
4. 实现外部 PubMed 链接跳转。

---

## 7. 新增/修改文件总览

### 7.1 知识图谱 RAG 相关

- 修改：`frontend/scripts/cxToKgGraph.mjs`
- 修改：`frontend/src/data/kg-graph.json`（重新生成）
- 修改：`frontend/public/kg-graph.json`（重新生成）
- 修改：`server/fixedSystemPrompt.js`
- 修改：`server/index.js`
- 修改：`frontend/src/pages/AiChat/AiChat.jsx`
- 新增：`server/data/kg-graph.json`（或构建同步脚本）
- 新增：`server/kgRag.js`
- 新增：`server/ragPromptBuilder.js`
- 新增：`server/citationValidator.js`
- 新增：`server/auditLogger.js`

### 7.2 AI 安全相关

- 修改：`server/fixedSystemPrompt.js`
- 修改：`server/reflectSystemPrompt.js`（如需要追加约束）
- 修改：`server/reflect.js`（加强 schema 校验）
- 修改：`server/index.js`
- 修改：`frontend/src/pages/AiChat/AiChat.jsx`
- 新增：`server/inputGuard.js`
- 新增：`server/outputGuard.js`
- 新增：`server/safetyPolicy.js`
- 新增：`server/safetyGuard.js`
- 新增：`server/safetyLogger.js`
- 新增：`server/rateLimiter.js`

---

## 8. 风险与注意事项

1. **来源缺失风险**：当前知识图谱无 PMID/DOI，RAG 来源只能标注到「平台知识图谱」层级，不能替代具体文献引用。需在 CX 层逐步补全。
2. **检索幻觉风险**：关键词匹配可能召回不相关边，需在 system prompt 中要求模型判断证据是否相关，不强行引用。
3. **医疗合规风险**：AI 回答必须始终附带「非诊断、非医疗建议」声明；涉及诊断/用药必须引导就医。
4. **数据隐私风险**：用户查询、检索证据、长期记忆需按用户隔离，生产环境必须 HTTPS + 加密存储。
5. **成本风险**：RAG 增加一次内存检索（可忽略），但安全 Judge 和审计日志会带来额外 token/存储开销，需设置监控。
6. **知识图谱更新风险**：CX 更新后需重新运行 `npm run build:kg` 并重启 server，建议增加热重载或构建时同步机制。

---

## 9. 参考来源

- [Medical Graph RAG: Evidence-based medical LLM via graph retrieval-augmented generation](https://aclanthology.org/2025.acl-long.1381/) — ACL 2025
- [MedRAG: Enhancing retrieval-augmented generation with knowledge graph-elicited reasoning for healthcare copilot](https://dl.acm.org/doi/10.1145/3696410.3714782) — WWW 2025
- [Leveraging Medical Knowledge Graphs Into Large Language Models for Diagnosis Prediction](https://ai.jmir.org/2025/1/e58670) — JMIR AI 2025
- [AMG-RAG: Agentic Medical Graph-RAG](https://github.com/MrRezaeiUofT/AMG-RAG) — GitHub
- [BioGraphRAG - Biomedical Knowledge Graph Retrieval Augmented Generation](https://nebula-graph.io/posts/biographrag-biomedical-knowledge-graph-retrieval-augmented-generation)
- [LLM Guardrails: Strategies & Best Practices in 2025](https://leanware.co/insights/llm-guardrails)
- [What guardrails are essential for LLM-powered healthcare applications?](https://milvus.io/ai-quick-reference/what-guardrails-are-essential-for-llmpowered-healthcare-applications)
- [An automated framework for assessing how well LLMs cite relevant medical references](https://www.nature.com/articles/s41467-025-58551-6) — Nature Communications 2025
