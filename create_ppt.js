const pptxgen = require("pptxgenjs");

// 配色方案 - 医疗健康主题
const C = {
  primary: "1B4D5C",      // 深青色 - 信任、专业
  secondary: "7EC8C8",    // 浅青色
  accent: "E8785A",       // 温暖珊瑚 - 关怀
  dark: "142E3A",         // 深蓝
  light: "FAFAF8",        // 暖白
  text: "2D3748",         // 深灰正文
  muted: "718096",        // 浅灰辅助
  white: "FFFFFF",
};

let pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.author = 'SpectraLink 团队';
pres.title = 'SpectraLink 项目汇报';

// ========================================
// Slide 1: 封面
// ========================================
let s1 = pres.addSlide();
s1.background = { color: C.dark };

// 装饰圆形
s1.addShape(pres.shapes.OVAL, {
  x: 7.5, y: 0.5, w: 3, h: 3,
  fill: { color: C.primary, transparency: 25 }
});
// 左侧强调条
s1.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 1.8, w: 0.15, h: 2.0,
  fill: { color: C.accent }
});

s1.addText("SpectraLink", {
  x: 0.6, y: 1.6, w: 7, h: 0.9,
  fontSize: 54, fontFace: "Arial", bold: true,
  color: C.white, align: "left"
});
s1.addText("面向孤独症儿童照顾者的\n神经符号 AI 支持系统", {
  x: 0.6, y: 2.5, w: 7, h: 1.0,
  fontSize: 22, fontFace: "Arial",
  color: C.secondary, align: "left"
});
s1.addText("Medical Grand Challenge 2026  |  项目编号：MGC_2026_1395", {
  x: 0.6, y: 3.7, w: 7, h: 0.4,
  fontSize: 14, fontFace: "Arial",
  color: C.muted, align: "left"
});
s1.addText("团队：SpectraLink  |  北京大学 及 合作院校", {
  x: 0.6, y: 4.1, w: 7, h: 0.4,
  fontSize: 13, fontFace: "Arial",
  color: C.muted, align: "left"
});

// ========================================
// Slide 2: 项目背景 — 孤独症的挑战
// ========================================
let s2 = pres.addSlide();
s2.background = { color: C.light };

s2.addText("项目背景：孤独症的严峻挑战", {
  x: 0.5, y: 0.4, w: 9, h: 0.6,
  fontSize: 32, fontFace: "Arial", bold: true,
  color: C.primary, align: "left"
});

const statCards = [
  { num: "6180万", label: "2021 年全球 ASD\n患者数量", color: C.primary },
  { num: "1.8%", label: "中国 0-6 岁\n儿童患病率", color: C.accent },
  { num: "0.7%", label: "中国 6-12 岁\n儿童患病率", color: C.secondary },
];
statCards.forEach((card, i) => {
  let x = 0.5 + i * 3.2;
  s2.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 1.2, w: 2.9, h: 2.2,
    fill: { color: C.white },
    shadow: { type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.08 }
  });
  s2.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 1.2, w: 2.9, h: 0.08,
    fill: { color: card.color }
  });
  s2.addText(card.num, {
    x: x, y: 1.5, w: 2.9, h: 0.7,
    fontSize: 36, fontFace: "Arial", bold: true,
    color: card.color, align: "center"
  });
  s2.addText(card.label, {
    x: x + 0.2, y: 2.3, w: 2.5, h: 0.8,
    fontSize: 14, fontFace: "Arial",
    color: C.text, align: "center"
  });
});

s2.addText("孤独症谱系障碍（ASD）是一种终身性神经发育疾病，临床表现高度异质，需要个性化的行为干预、早期症状监测和长期照护管理。", {
  x: 0.5, y: 3.8, w: 9, h: 0.7,
  fontSize: 14, fontFace: "Arial",
  color: C.text, align: "left"
});

s2.addText("照顾者长期面临可及性差、缺乏个性化指导、信息碎片化等难以满足的日常照护需求。", {
  x: 0.5, y: 4.4, w: 9, h: 0.5,
  fontSize: 15, fontFace: "Arial", italic: true,
  color: C.primary, align: "left"
});

// ========================================
// Slide 3: 问题陈述
// ========================================
let s3 = pres.addSlide();
s3.background = { color: C.light };

s3.addText("问题：现有照护方案的局限", {
  x: 0.5, y: 0.4, w: 9, h: 0.6,
  fontSize: 32, fontFace: "Arial", bold: true,
  color: C.primary, align: "left"
});

const problems = [
  { title: "专业服务受限", items: ["康复人才严重短缺", "服务费用高昂", "地理覆盖不足", "无法提供 7×24 支持"] },
  { title: "现有信息渠道", items: ["信息碎片化、缺乏循证验证", "无法适配个体化症状", "通用 App 缺乏临床依据", "普通 AI 聊天存在幻觉风险"] },
];
problems.forEach((col, i) => {
  let x = 0.5 + i * 5.0;
  s3.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 1.1, w: 4.5, h: 3.8,
    fill: { color: C.white },
    shadow: { type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.08 }
  });
  s3.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 1.1, w: 0.08, h: 3.8,
    fill: { color: i === 0 ? C.accent : C.primary }
  });
  s3.addText(col.title, {
    x: x + 0.3, y: 1.3, w: 4.0, h: 0.5,
    fontSize: 18, fontFace: "Arial", bold: true,
    color: i === 0 ? C.accent : C.primary, align: "left"
  });
  col.items.forEach((item, j) => {
    s3.addText(item, {
      x: x + 0.4, y: 1.9 + j * 0.5, w: 3.9, h: 0.45,
      fontSize: 15, fontFace: "Arial",
      color: C.text, align: "left", bullet: true
    });
  });
});

s3.addText("当前没有任何方案能够同时兼顾临床可靠性、个性化、可及性和经济性。", {
  x: 0.5, y: 5.0, w: 9, h: 0.4,
  fontSize: 15, fontFace: "Arial", bold: true,
  color: C.accent, align: "center"
});

// ========================================
// Slide 4: 目标用户
// ========================================
let s4 = pres.addSlide();
s4.background = { color: C.light };

s4.addText("目标用户", {
  x: 0.5, y: 0.4, w: 9, h: 0.6,
  fontSize: 32, fontFace: "Arial", bold: true,
  color: C.primary, align: "left"
});

// 核心用户
s4.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 1.2, w: 4.5, h: 3.5,
  fill: { color: C.primary }
});
s4.addText("核心用户", {
  x: 0.7, y: 1.4, w: 4.1, h: 0.4,
  fontSize: 14, fontFace: "Arial", bold: true,
  color: C.secondary, align: "left"
});
s4.addText("家庭照顾者", {
  x: 0.7, y: 1.85, w: 4.1, h: 0.5,
  fontSize: 26, fontFace: "Arial", bold: true,
  color: C.white, align: "left"
});
s4.addText([
  { text: "ASD 儿童的父母", options: { bullet: true, breakLine: true, color: C.white } },
  { text: "参与日常照护的祖父母", options: { bullet: true, breakLine: true, color: C.white } },
  { text: "主要居家照护人", options: { bullet: true, breakLine: true, color: C.white } },
  { text: "需要 7×24 循证指导的人群", options: { bullet: true, color: C.white } },
], {
  x: 0.7, y: 2.5, w: 4.1, h: 2.0,
  fontSize: 15, fontFace: "Arial",
  color: C.white
});

// 次要用户
s4.addShape(pres.shapes.RECTANGLE, {
  x: 5.2, y: 1.2, w: 4.5, h: 3.5,
  fill: { color: C.white },
  shadow: { type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.08 }
});
s4.addShape(pres.shapes.RECTANGLE, {
  x: 5.2, y: 1.2, w: 0.08, h: 3.5,
  fill: { color: C.accent }
});
s4.addText("次要用户", {
  x: 5.4, y: 1.4, w: 4.1, h: 0.4,
  fontSize: 14, fontFace: "Arial", bold: true,
  color: C.accent, align: "left"
});
s4.addText("专业人士", {
  x: 5.4, y: 1.85, w: 4.1, h: 0.5,
  fontSize: 26, fontFace: "Arial", bold: true,
  color: C.text, align: "left"
});
s4.addText([
  { text: "特殊教育教师", options: { bullet: true, breakLine: true, color: C.text } },
  { text: "康复治疗师", options: { bullet: true, breakLine: true, color: C.text } },
  { text: "儿科护士", options: { bullet: true, breakLine: true, color: C.text } },
  { text: "康复后的延伸支持工具", options: { bullet: true, color: C.text } },
], {
  x: 5.4, y: 2.5, w: 4.1, h: 2.0,
  fontSize: 15, fontFace: "Arial",
  color: C.text
});

// ========================================
// Slide 5: 项目愿景
// ========================================
let s5 = pres.addSlide();
s5.background = { color: C.light };

s5.addText("SpectraLink：我们的解决方案", {
  x: 0.5, y: 0.4, w: 9, h: 0.6,
  fontSize: 32, fontFace: "Arial", bold: true,
  color: C.primary, align: "left"
});

// 中央概念
s5.addShape(pres.shapes.RECTANGLE, {
  x: 3.0, y: 1.3, w: 4.0, h: 1.4,
  fill: { color: C.primary }
});
s5.addText("神经符号 AI", {
  x: 3.0, y: 1.5, w: 4.0, h: 0.5,
  fontSize: 24, fontFace: "Arial", bold: true,
  color: C.white, align: "center"
});
s5.addText("知识图谱 + 大语言模型融合", {
  x: 3.0, y: 2.05, w: 4.0, h: 0.4,
  fontSize: 14, fontFace: "Arial",
  color: C.secondary, align: "center"
});

// 左侧 - 知识图谱
s5.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 1.5, w: 2.2, h: 1.0,
  fill: { color: C.white },
  shadow: { type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.08 }
});
s5.addText("知识图谱", {
  x: 0.5, y: 1.65, w: 2.2, h: 0.4,
  fontSize: 15, fontFace: "Arial", bold: true,
  color: C.accent, align: "center"
});
s5.addText("循证临床知识库", {
  x: 0.5, y: 2.05, w: 2.2, h: 0.4,
  fontSize: 12, fontFace: "Arial",
  color: C.muted, align: "center"
});

// 右侧 - LLM
s5.addShape(pres.shapes.RECTANGLE, {
  x: 7.3, y: 1.5, w: 2.2, h: 1.0,
  fill: { color: C.white },
  shadow: { type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.08 }
});
s5.addText("大语言模型", {
  x: 7.3, y: 1.65, w: 2.2, h: 0.4,
  fontSize: 15, fontFace: "Arial", bold: true,
  color: C.accent, align: "center"
});
s5.addText("自然语言交互", {
  x: 7.3, y: 2.05, w: 2.2, h: 0.4,
  fontSize: 12, fontFace: "Arial",
  color: C.muted, align: "center"
});

// 箭头
s5.addShape(pres.shapes.LINE, {
  x: 2.7, y: 2.0, w: 0.3, h: 0,
  line: { color: C.accent, width: 2, endArrowType: "triangle" }
});
s5.addShape(pres.shapes.LINE, {
  x: 7.0, y: 2.0, w: 0.3, h: 0,
  line: { color: C.accent, width: 2, endArrowType: "triangle" }
});

// 提供什么
s5.addText("SpectraLink 提供：", {
  x: 0.5, y: 3.2, w: 9, h: 0.4,
  fontSize: 17, fontFace: "Arial", bold: true,
  color: C.primary, align: "left"
});
const provides = [
  "个性化行为干预策略",
  "日常照护指导方案",
  "可追溯证据来源的循证回答",
  "照顾者心理健康支持",
  "长期记忆实现连续照护上下文"
];
provides.forEach((item, i) => {
  s5.addText(item, {
    x: 0.7 + (i % 2) * 4.8, y: 3.65 + Math.floor(i / 2) * 0.5, w: 4.5, h: 0.45,
    fontSize: 15, fontFace: "Arial",
    color: C.text, align: "left", bullet: true
  });
});

s5.addText("不提供：临床诊断、医疗治疗方案决策、危机紧急干预。", {
  x: 0.5, y: 4.9, w: 9, h: 0.4,
  fontSize: 13, fontFace: "Arial", italic: true,
  color: C.muted, align: "left"
});

// ========================================
// Slide 6: 核心功能
// ========================================
let s6 = pres.addSlide();
s6.background = { color: C.light };

s6.addText("核心功能", {
  x: 0.5, y: 0.4, w: 9, h: 0.6,
  fontSize: 32, fontFace: "Arial", bold: true,
  color: C.primary, align: "left"
});

const features = [
  { title: "AI 照护助手", desc: "基于 DeepSeek 的神经符号 AI 对话，知识图谱 grounding 消除幻觉，长期记忆实现个性化照护指导。", color: C.primary },
  { title: "社交社区", desc: "照顾者发布动态、分享经验，与同路人建立互助支持网络，缓解孤独感。", color: C.accent },
  { title: "帮助中心", desc: "基于 Neo4j 构建的 ASD 照护知识图谱，提供专业资源、医生推荐、机构联系信息。", color: C.secondary },
  { title: "个人档案", desc: "记录照顾者与患儿档案、照护历史、成长档案，支持个性化推荐与设置。", color: "4A7C59" },
];

features.forEach((feat, i) => {
  let col = i % 2;
  let row = Math.floor(i / 2);
  let x = 0.5 + col * 5.0;
  let y = 1.1 + row * 2.2;

  s6.addShape(pres.shapes.RECTANGLE, {
    x: x, y: y, w: 4.5, h: 2.0,
    fill: { color: C.white },
    shadow: { type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.08 }
  });
  s6.addShape(pres.shapes.RECTANGLE, {
    x: x, y: y, w: 0.1, h: 2.0,
    fill: { color: feat.color }
  });
  s6.addText(feat.title, {
    x: x + 0.25, y: y + 0.2, w: 4.0, h: 0.4,
    fontSize: 20, fontFace: "Arial", bold: true,
    color: feat.color, align: "left"
  });
  s6.addText(feat.desc, {
    x: x + 0.25, y: y + 0.65, w: 4.0, h: 1.2,
    fontSize: 14, fontFace: "Arial",
    color: C.text, align: "left"
  });
});

// ========================================
// Slide 7: 技术架构
// ========================================
let s7 = pres.addSlide();
s7.background = { color: C.light };

s7.addText("技术架构", {
  x: 0.5, y: 0.4, w: 9, h: 0.6,
  fontSize: 32, fontFace: "Arial", bold: true,
  color: C.primary, align: "left"
});

const layers = [
  { label: "前端层（React 19 + Tailwind + TypeScript）", color: C.secondary, y: 1.2 },
  { label: "AI 网关（Express + MCP + DeepSeek API）", color: C.primary, y: 1.9 },
  { label: "知识图谱（Neo4j）", color: C.accent, y: 2.6 },
  { label: "数据层（Firebase Auth + Firestore）", color: "4A7C59", y: 3.3 },
];

layers.forEach((layer) => {
  s7.addShape(pres.shapes.RECTANGLE, {
    x: 2.5, y: layer.y, w: 5.0, h: 0.55,
    fill: { color: layer.color }
  });
  s7.addText(layer.label, {
    x: 2.5, y: layer.y + 0.1, w: 5.0, h: 0.35,
    fontSize: 13, fontFace: "Arial", bold: true,
    color: C.white, align: "center"
  });
});

for (let i = 0; i < 3; i++) {
  s7.addShape(pres.shapes.LINE, {
    x: 5.0, y: 1.75 + i * 0.7, w: 0, h: 0.15,
    line: { color: C.muted, width: 1.5, endArrowType: "triangle" }
  });
}

s7.addText("技术创新点：", {
  x: 0.5, y: 4.1, w: 9, h: 0.4,
  fontSize: 17, fontFace: "Arial", bold: true,
  color: C.primary, align: "left"
});
[
  "MCP 协议保障 LLM API Key 安全，不暴露给前端",
  "反思式记忆：自动对话摘要 + 照顾者状态追踪",
  "知识图谱 grounding 有效消除 AI 幻觉"
].forEach((item, i) => {
  s7.addText(item, {
    x: 0.7, y: 4.5 + i * 0.4, w: 9, h: 0.35,
    fontSize: 14, fontFace: "Arial",
    color: C.text, align: "left", bullet: true
  });
});

// ========================================
// Slide 8: 产品分析（SWOT）
// ========================================
let s8 = pres.addSlide();
s8.background = { color: C.light };

s8.addText("产品分析", {
  x: 0.5, y: 0.4, w: 9, h: 0.6,
  fontSize: 32, fontFace: "Arial", bold: true,
  color: C.primary, align: "left"
});

const swot = [
  { label: "优势", items: ["临床安全性与可解释性", "高度个性化与适应性", "7×24 移动可及性", "兼顾患儿发展与照顾者心理"], color: C.primary, x: 0.5, y: 1.1 },
  { label: "劣势", items: ["知识图谱需专家持续维护", "数字素养门槛影响采纳", "网络依赖，离线功能有限", "非诊断工具定位"], color: C.accent, x: 5.0, y: 1.1 },
  { label: "机会", items: ["ASD 患病率持续上升", "数字健康政策利好", "LLM/KG 技术日趋成熟", "扩展至成人照护与可穿戴"], color: "4A7C59", x: 0.5, y: 3.3 },
  { label: "威胁", items: ["心理健康 App 竞争激烈", "医疗 AI 监管趋严", "公众对 AI 儿科干预信任不足", "数字鸿沟加剧不平等"], color: "8B5A2B", x: 5.0, y: 3.3 },
];

swot.forEach((quad) => {
  s8.addShape(pres.shapes.RECTANGLE, {
    x: quad.x, y: quad.y, w: 4.5, h: 2.0,
    fill: { color: C.white },
    shadow: { type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.08 }
  });
  s8.addShape(pres.shapes.RECTANGLE, {
    x: quad.x, y: quad.y, w: 4.5, h: 0.08,
    fill: { color: quad.color }
  });
  s8.addText(quad.label, {
    x: quad.x + 0.15, y: quad.y + 0.15, w: 4.2, h: 0.35,
    fontSize: 13, fontFace: "Arial", bold: true,
    color: quad.color, align: "left"
  });
  quad.items.forEach((item, i) => {
    s8.addText(item, {
      x: quad.x + 0.25, y: quad.y + 0.55 + i * 0.35, w: 4.0, h: 0.3,
      fontSize: 13, fontFace: "Arial",
      color: C.text, align: "left", bullet: true
    });
  });
});

// ========================================
// Slide 9: 商业模式
// ========================================
let s9 = pres.addSlide();
s9.background = { color: C.light };

s9.addText("商业模式：免费增值", {
  x: 0.5, y: 0.4, w: 9, h: 0.6,
  fontSize: 32, fontFace: "Arial", bold: true,
  color: C.primary, align: "left"
});

const tiers = [
  { name: "免费版", price: "¥0", features: ["循证照护指导", "基础 AI 对话", "社区交流", "知识图谱检索"], color: C.secondary },
  { name: "进阶版", price: "团体咨询", features: ["团体专家咨询", "优先响应", "扩展知识库", "照顾者工作坊"], color: C.primary },
  { name: "高级版", price: "1 对 1", features: ["一对一专家支持", "个性化照护方案", "专属治疗师匹配", "高级数据分析"], color: C.accent },
];

tiers.forEach((tier, i) => {
  let x = 0.5 + i * 3.2;
  s9.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 1.2, w: 2.9, h: 3.8,
    fill: { color: C.white },
    shadow: { type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.08 }
  });
  s9.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 1.2, w: 2.9, h: 0.6,
    fill: { color: tier.color }
  });
  s9.addText(tier.name, {
    x: x, y: 1.3, w: 2.9, h: 0.4,
    fontSize: 16, fontFace: "Arial", bold: true,
    color: C.white, align: "center"
  });
  s9.addText(tier.price, {
    x: x, y: 1.9, w: 2.9, h: 0.4,
    fontSize: 20, fontFace: "Arial", bold: true,
    color: tier.color, align: "center"
  });
  tier.features.forEach((feat, j) => {
    s9.addText(feat, {
      x: x + 0.2, y: 2.4 + j * 0.5, w: 2.5, h: 0.4,
      fontSize: 13, fontFace: "Arial",
      color: C.text, align: "left", bullet: true
    });
  });
});

s9.addText("收费收入用于知识图谱持续更新、临床审计及平台运维，实现社会影响与商业可持续的平衡。", {
  x: 0.5, y: 5.1, w: 9, h: 0.4,
  fontSize: 13, fontFace: "Arial", italic: true,
  color: C.muted, align: "center"
});

// ========================================
// Slide 10: 实施路线图
// ========================================
let s10 = pres.addSlide();
s10.background = { color: C.light };

s10.addText("实施路线图", {
  x: 0.5, y: 0.4, w: 9, h: 0.6,
  fontSize: 32, fontFace: "Arial", bold: true,
  color: C.primary, align: "left"
});

const phases = [
  { phase: "第一阶段", title: "试点验证", desc: "在 ASD 康复中心开展试点\n康复后延伸照护支持\n持续收集用户反馈迭代", color: C.secondary },
  { phase: "第二阶段", title: "正式发布", desc: "免费增值模式全面上线\n多渠道市场推广\n与专业机构建立合作", color: C.primary },
  { phase: "第三阶段", title: "规模扩展", desc: "扩展至青少年/成人 ASD 照护\n多语言服务支持\n可穿戴设备集成", color: C.accent },
];

phases.forEach((phase, i) => {
  let x = 0.5 + i * 3.2;
  s10.addShape(pres.shapes.OVAL, {
    x: x + 1.0, y: 1.2, w: 0.9, h: 0.9,
    fill: { color: phase.color }
  });
  s10.addText(String(i + 1), {
    x: x + 1.0, y: 1.35, w: 0.9, h: 0.6,
    fontSize: 28, fontFace: "Arial", bold: true,
    color: C.white, align: "center"
  });
  s10.addText(phase.phase, {
    x: x, y: 2.3, w: 2.9, h: 0.35,
    fontSize: 14, fontFace: "Arial", bold: true,
    color: phase.color, align: "center"
  });
  s10.addText(phase.title, {
    x: x, y: 2.7, w: 2.9, h: 0.35,
    fontSize: 18, fontFace: "Arial", bold: true,
    color: C.text, align: "center"
  });
  s10.addText(phase.desc, {
    x: x + 0.15, y: 3.1, w: 2.6, h: 1.2,
    fontSize: 12, fontFace: "Arial",
    color: C.muted, align: "center"
  });

  if (i < 2) {
    s10.addShape(pres.shapes.LINE, {
      x: x + 2.9, y: 1.65, w: 0.3, h: 0,
      line: { color: C.muted, width: 2, endArrowType: "triangle" }
    });
  }
});

s10.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 4.5, w: 9, h: 1.0,
  fill: { color: C.white },
  shadow: { type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.08 }
});
s10.addText("关键成功指标：照顾者压力缓解  |  干预依从性  |  患儿行为稳定性  |  成长档案驱动的用户留存", {
  x: 0.7, y: 4.7, w: 8.6, h: 0.6,
  fontSize: 13, fontFace: "Arial",
  color: C.text, align: "center"
});

// ========================================
// Slide 11: 团队介绍
// ========================================
let s11 = pres.addSlide();
s11.background = { color: C.light };

s11.addText("团队介绍", {
  x: 0.5, y: 0.4, w: 9, h: 0.6,
  fontSize: 32, fontFace: "Arial", bold: true,
  color: C.primary, align: "left"
});

const team = [
  { name: "贺紫辰", school: "北京大学临床医学", role: "临床负责人" },
  { name: "许雅静", school: "北京大学护理学院", role: "护理与照护" },
  { name: "朱丽烨", school: "北京大学元培学院", role: "智能科学与技术" },
  { name: "代惠紫", school: "北京联合大学", role: "视觉传达设计" },
  { name: "陈柏彤", school: "北京大学护理学院", role: "护理研究" },
  { name: "郑辰颖", school: "北京大学护理学院", role: "护理研究" },
  { name: "刘卓凡", school: "北京大学护理学院", role: "护理研究" },
  { name: "任孜菡", school: "北京大学光华管理学院", role: "商业策略" },
];

team.forEach((member, i) => {
  let col = i % 4;
  let row = Math.floor(i / 4);
  let x = 0.5 + col * 2.4;
  let y = 1.2 + row * 2.0;

  s11.addShape(pres.shapes.RECTANGLE, {
    x: x, y: y, w: 2.2, h: 1.7,
    fill: { color: C.white },
    shadow: { type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.08 }
  });
  s11.addShape(pres.shapes.OVAL, {
    x: x + 0.7, y: y + 0.15, w: 0.8, h: 0.8,
    fill: { color: C.secondary }
  });
  s11.addText(member.name.charAt(0), {
    x: x + 0.7, y: y + 0.25, w: 0.8, h: 0.6,
    fontSize: 24, fontFace: "Arial", bold: true,
    color: C.white, align: "center"
  });
  s11.addText(member.name, {
    x: x, y: y + 1.0, w: 2.2, h: 0.3,
    fontSize: 13, fontFace: "Arial", bold: true,
    color: C.text, align: "center"
  });
  s11.addText(member.school, {
    x: x, y: y + 1.3, w: 2.2, h: 0.35,
    fontSize: 10, fontFace: "Arial",
    color: C.muted, align: "center"
  });
});

// ========================================
// Slide 12: 结束页
// ========================================
let s12 = pres.addSlide();
s12.background = { color: C.dark };

s12.addShape(pres.shapes.OVAL, {
  x: -1, y: 3, w: 5, h: 5,
  fill: { color: C.primary, transparency: 20 }
});
s12.addShape(pres.shapes.OVAL, {
  x: 7, y: -1, w: 4, h: 4,
  fill: { color: C.accent, transparency: 15 }
});

s12.addText("感谢聆听", {
  x: 0, y: 1.8, w: 10, h: 1.0,
  fontSize: 48, fontFace: "Arial", bold: true,
  color: C.white, align: "center"
});
s12.addText("SpectraLink：用 AI 赋能孤独症照顾者", {
  x: 0, y: 2.8, w: 10, h: 0.5,
  fontSize: 18, fontFace: "Arial",
  color: C.secondary, align: "center"
});
s12.addText("Medical Grand Challenge 2026  |  SpectraLink 团队  |  MGC_2026_1395", {
  x: 0, y: 3.4, w: 10, h: 0.4,
  fontSize: 13, fontFace: "Arial",
  color: C.muted, align: "center"
});

// 保存
const outputPath = "/Users/juliaaa/workspace/asd_app/SpectraLink_Pitch_Deck.pptx";
pres.writeFile({ fileName: outputPath });
console.log("演示文稿已保存至: " + outputPath);
