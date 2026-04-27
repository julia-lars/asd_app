#!/usr/bin/env node
/**
 * 将 Cytoscape CX 1.x（public 下的 .cx）转为 Cytoscape.js 可用的 elements JSON。
 * 唯一转换入口：修改 CX 路径或逻辑后请运行
 *   npm run build:kg
 * 会生成 public/kg-graph.json，前端只加载该文件，不在浏览器内解析 .cx。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = path.join(__dirname, '..');

/** @param {string} typeTag */
function typeTagColor(typeTag) {
  const palette = [
    '#1d4ed8',
    '#2563eb',
    '#0284c7',
    '#0ea5e9',
    '#38bdf8',
    '#60a5fa',
    '#7dd3fc',
    '#93c5fd',
  ];
  let h = 2166136261;
  const s = String(typeTag || 'x');
  for (let i = 0; i < s.length; i += 1) {
    h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  }
  return palette[(h >>> 0) % palette.length];
}

/**
 * @param {unknown} cxArray
 * @returns {{ elements: object[], networkName: string, nodeCount: number, edgeCount: number }}
 */
export function convertCxFileToKgGraph(cxArray) {
  if (!Array.isArray(cxArray)) {
    throw new Error('CX 应为 JSON 数组');
  }

  const nodesAsp = cxArray.find((o) => o && o.nodes);
  const edgesAsp = cxArray.find((o) => o && o.edges);
  const layoutAsp = cxArray.find((o) => o && o.cartesianLayout);
  const netAsp = cxArray.find((o) => o && o.networkAttributes);
  const nodeAttrAsp = cxArray.find((o) => o && o.nodeAttributes);

  if (!nodesAsp?.nodes?.length) {
    throw new Error('CX 中未找到 nodes');
  }

  let networkName = '知识图谱';
  const na = netAsp?.networkAttributes;
  if (Array.isArray(na)) {
    const nameRow = na.find((r) => r.n === 'name');
    if (nameRow?.v) networkName = String(nameRow.v).replace(/\+/g, ' ');
  }

  /** @type {Map<number, { subject?: string, object?: string }>} */
  const nodeMeta = new Map();
  if (Array.isArray(nodeAttrAsp?.nodeAttributes)) {
    for (const row of nodeAttrAsp.nodeAttributes) {
      const id = row.po;
      if (id == null) continue;
      if (!nodeMeta.has(id)) nodeMeta.set(id, {});
      const m = nodeMeta.get(id);
      if (row.n === 'subject_type_abbr') m.subject = String(row.v ?? '');
      if (row.n === 'object_type_abbr') m.object = String(row.v ?? '');
    }
  }

  /** @type {Map<number, { x: number, y: number }>} */
  const positions = new Map();
  if (Array.isArray(layoutAsp?.cartesianLayout)) {
    for (const p of layoutAsp.cartesianLayout) {
      if (p.node != null && typeof p.x === 'number' && typeof p.y === 'number') {
        positions.set(p.node, { x: p.x, y: p.y });
      }
    }
  }

  const elements = [];

  for (const n of nodesAsp.nodes) {
    const rawId = n['@id'];
    if (rawId == null) continue;
    const pos = positions.get(rawId) ?? { x: (Math.random() - 0.5) * 400, y: (Math.random() - 0.5) * 400 };
    const meta = nodeMeta.get(rawId) ?? {};
    const typeTag = (meta.subject || meta.object || 'other').split(/[;,]/)[0].trim() || 'other';
    const color = typeTagColor(typeTag);

    elements.push({
      group: 'nodes',
      data: {
        id: `n${rawId}`,
        label: n.n != null ? String(n.n) : String(rawId),
        rawId,
        typeTag,
        color,
      },
      position: { x: pos.x, y: pos.y },
    });
  }

  const nodeIds = new Set(elements.filter((e) => e.group === 'nodes').map((e) => e.data.id));
  let edgeCount = 0;
  if (edgesAsp?.edges?.length) {
    for (const e of edgesAsp.edges) {
      const sid = `n${e.s}`;
      const tid = `n${e.t}`;
      if (!nodeIds.has(sid) || !nodeIds.has(tid)) continue;
      elements.push({
        group: 'edges',
        data: {
          id: `e${e['@id']}`,
          source: sid,
          target: tid,
          label: e.i != null ? String(e.i) : '',
        },
      });
      edgeCount += 1;
    }
  }

  const nodeCount = nodesAsp.nodes.length;
  return { elements, networkName, nodeCount, edgeCount };
}

function main() {
  const cxRel = process.argv[2] || 'public/match-autism-spectrum-disorder.cx';
  const cxPath = path.isAbsolute(cxRel) ? cxRel : path.join(FRONTEND_ROOT, cxRel);
  const outSrc = path.join(FRONTEND_ROOT, 'src', 'data', 'kg-graph.json');
  const outPublic = path.join(FRONTEND_ROOT, 'public', 'kg-graph.json');

  if (!fs.existsSync(cxPath)) {
    console.error('[cxToKgGraph] 找不到 CX 文件:', cxPath);
    process.exit(1);
  }

  const raw = fs.readFileSync(cxPath, 'utf8');
  const cx = JSON.parse(raw);
  const { elements, networkName, nodeCount, edgeCount } = convertCxFileToKgGraph(cx);

  const payload = {
    version: 1,
    networkName,
    generatedAt: new Date().toISOString(),
    sourceCx: path.basename(cxPath),
    meta: { nodeCount, edgeCount, elementCount: elements.length },
    elements,
  };

  const json = JSON.stringify(payload);
  fs.mkdirSync(path.dirname(outSrc), { recursive: true });
  fs.writeFileSync(outSrc, json, 'utf8');
  fs.writeFileSync(outPublic, json, 'utf8');
  console.log(
    `[cxToKgGraph] 已写入 ${path.relative(FRONTEND_ROOT, outSrc)} 与 ${path.relative(FRONTEND_ROOT, outPublic)}（节点 ${nodeCount}，边 ${edgeCount}，elements ${elements.length}）`,
  );
}

main();
