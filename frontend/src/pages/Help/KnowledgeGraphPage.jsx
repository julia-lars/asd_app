import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cytoscape from 'cytoscape';
import { useAuth } from '../../contexts/AuthContext';

const DEFAULT_STATUS = '拖拽平移，滚轮缩放；点击节点或关系查看详情，输入关键词可聚焦相关邻域。';
const FIT_PADDING = 96;
const CANVAS_MIN_HEIGHT = 440;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const getTextLength = (value) => String(value || '').trim().length;
const getTypeTag = (ele) => String(ele.data('typeTag') || '').trim();

const BLUE_NODE_PALETTE = [
  '#eff6ff',
  '#dbeafe',
  '#bfdbfe',
  '#93c5fd',
  '#60a5fa',
  '#38bdf8',
];

const getPaletteIndex = (ele) => {
  const seed = `${getTypeTag(ele)}:${String(ele.data('label') || '')}`;
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) % BLUE_NODE_PALETTE.length;
  }
  return hash;
};

const getNodeFill = (ele) => BLUE_NODE_PALETTE[getPaletteIndex(ele)];

const getNodeBorder = (ele) => {
  const index = getPaletteIndex(ele);
  return index >= 4 ? '#e0f2fe' : '#60a5fa';
};

const getNodeTextColor = (ele) => {
  const index = getPaletteIndex(ele);
  return index >= 3 ? '#eff6ff' : '#0f172a';
};

const getNodeTextOutline = (ele) => {
  const index = getPaletteIndex(ele);
  return index >= 3 ? '#0f172a' : '#f8fafc';
};

const getNodeWidth = (ele) => {
  const labelLength = getTextLength(ele.data('label'));
  const typeBoost = getTypeTag(ele) ? 12 : 0;
  return clamp(96 + labelLength * 7 + typeBoost, 96, 220);
};

const getNodeHeight = (ele) => {
  const labelLength = getTextLength(ele.data('label'));
  const lines = Math.max(1, Math.ceil(labelLength / 10));
  return clamp(40 + lines * 10, 40, 84);
};

const getNodeFontSize = (ele) => {
  const labelLength = getTextLength(ele.data('label'));
  if (labelLength <= 8) return 13;
  if (labelLength <= 18) return 12;
  return 11;
};

const getEdgeWidth = (ele) => {
  const relLength = getTextLength(ele.data('label'));
  return clamp(1.1 + relLength * 0.04, 1.1, 2.1);
};

const formatNodeStatus = (node) => {
  const label = String(node.data('label') || '未命名节点');
  const typeTag = getTypeTag(node) || '未分类';
  const relationCount = node.connectedEdges().length;
  return `节点面板：${label} · 类型 ${typeTag} · 关联 ${relationCount} 条关系`;
};

const formatEdgeStatus = (edge) => {
  const source = String(edge.source().data('label') || '未知来源');
  const target = String(edge.target().data('label') || '未知目标');
  const relation = String(edge.data('label') || '关联');
  return `关系面板：${source} -> ${relation} -> ${target}`;
};

const KnowledgeGraphPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const hostRef = useRef(null);
  const cyRef = useRef(null);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('知识图谱');
  const [status, setStatus] = useState(DEFAULT_STATUS);
  const [search, setSearch] = useState('');
  const [debugCount, setDebugCount] = useState(null);
  const searchDebounce = useRef(0);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (authLoading || !user) return undefined;

    const controller = new AbortController();
    const loadGraphData = async () => {
      setLoading(true);
      setError(null);
      setStatus(DEFAULT_STATUS);
      try {
        const response = await fetch('/kg-graph.json', {
          signal: controller.signal,
          cache: 'force-cache',
        });
        if (!response.ok) {
          throw new Error(`图谱数据加载失败（${response.status}）`);
        }
        const nextGraph = await response.json();
        setGraphData(nextGraph);
        setTitle(typeof nextGraph.networkName === 'string' ? nextGraph.networkName : '知识图谱');
        setDebugCount(Array.isArray(nextGraph?.elements) ? nextGraph.elements.length : 0);
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') return;
        setGraphData(null);
        setDebugCount(0);
        setError(fetchError instanceof Error ? fetchError.message : String(fetchError));
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadGraphData();
    return () => controller.abort();
  }, [authLoading, user]);

  const destroyCy = useCallback(() => {
    if (cyRef.current) {
      cyRef.current.destroy();
      cyRef.current = null;
    }
  }, []);

  const fitGraph = useCallback((padding = FIT_PADDING) => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.resize();
    cy.fit(cy.elements(), padding);
  }, []);

  useLayoutEffect(() => {
    if (authLoading || !user || !graphData) return undefined;

    const elements = graphData?.elements;
    if (!Array.isArray(elements) || elements.length === 0) {
      setError('图谱数据为空，请在 frontend 目录执行 npm run build:kg。');
      setDebugCount(0);
      return undefined;
    }

    setError(null);
    setStatus(DEFAULT_STATUS);

    const el = hostRef.current;
    if (!el) {
      setError('图谱容器未正确挂载。');
      return undefined;
    }

    destroyCy();

    try {
      const cy = cytoscape({
        container: el,
        elements,
        wheelSensitivity: 0.16,
        minZoom: 0.03,
        maxZoom: 4.2,
        pixelRatio: 'auto',
        style: [
          {
            selector: 'node',
            style: {
              label: 'data(label)',
              'background-color': getNodeFill,
              'background-opacity': 0.94,
              color: getNodeTextColor,
              'font-size': getNodeFontSize,
              'font-weight': 700,
              'line-height': 1.2,
              'text-valign': 'center',
              'text-halign': 'center',
              'text-justification': 'center',
              'text-wrap': 'wrap',
              'text-max-width': 132,
              'text-outline-width': 2,
              'text-outline-color': getNodeTextOutline,
              width: getNodeWidth,
              height: getNodeHeight,
              padding: '12px',
              shape: 'round-rectangle',
              'border-width': 1.6,
              'border-color': getNodeBorder,
              'border-opacity': 0.9,
              'overlay-opacity': 0,
              'shadow-blur': 18,
              'shadow-color': '#0f172a',
              'shadow-opacity': 0.24,
              'shadow-offset-x': 0,
              'shadow-offset-y': 6,
            },
          },
          {
            selector: 'node.hovered',
            style: {
              'border-width': 2.4,
              'border-color': '#e0f2fe',
              'border-opacity': 0.88,
              'shadow-blur': 26,
              'shadow-opacity': 0.46,
              'z-index': 850,
            },
          },
          {
            selector: 'node:selected',
            style: {
              'border-width': 3.5,
              'border-color': '#7dd3fc',
              'border-opacity': 1,
              'shadow-blur': 34,
              'shadow-color': '#38bdf8',
              'shadow-opacity': 0.55,
              'shadow-offset-y': 0,
              'text-outline-width': 3,
              'z-index': 999,
            },
          },
          {
            selector: 'node.search-hit',
            style: {
              'border-width': 3.2,
              'border-color': '#f8fafc',
              'border-opacity': 1,
              'shadow-blur': 30,
              'shadow-color': '#bae6fd',
              'shadow-opacity': 0.58,
              'z-index': 920,
            },
          },
          {
            selector: 'node.search-neighbor',
            style: {
              opacity: 0.96,
              'border-width': 2.2,
              'border-color': '#93c5fd',
              'border-opacity': 0.8,
            },
          },
          {
            selector: 'node.dim',
            style: {
              opacity: 0.12,
              'text-opacity': 0.18,
              'border-opacity': 0.08,
            },
          },
          {
            selector: 'edge',
            style: {
              width: getEdgeWidth,
              'line-color': '#94a3b8',
              'line-opacity': 0.34,
              'target-arrow-color': '#94a3b8',
              'target-arrow-shape': 'triangle',
              'target-arrow-fill': 'filled',
              'arrow-scale': 0.72,
              'curve-style': 'bezier',
              'source-endpoint': 'outside-to-node',
              'target-endpoint': 'outside-to-node',
              opacity: 0.34,
              label: '',
              'font-size': 9,
              color: '#dbeafe',
              'text-rotation': 'autorotate',
              'text-background-color': '#020617',
              'text-background-opacity': 0.88,
              'text-background-padding': '3px',
              'text-border-opacity': 0,
              'overlay-opacity': 0,
            },
          },
          {
            selector: 'edge.hovered',
            style: {
              opacity: 0.68,
              'line-opacity': 0.68,
              'line-color': '#cbd5e1',
              'target-arrow-color': '#cbd5e1',
              width: 2.1,
              label: 'data(label)',
              'z-index': 810,
            },
          },
          {
            selector: 'edge:selected',
            style: {
              opacity: 0.98,
              'line-opacity': 0.98,
              'line-color': '#38bdf8',
              'target-arrow-color': '#38bdf8',
              width: 2.8,
              'arrow-scale': 0.9,
              label: 'data(label)',
              'font-size': 10,
              color: '#f8fafc',
              'text-background-color': '#082f49',
              'text-background-opacity': 0.95,
              'z-index': 960,
            },
          },
          {
            selector: 'edge.search-neighbor',
            style: {
              opacity: 0.58,
              'line-opacity': 0.58,
              width: 1.9,
              'line-color': '#7dd3fc',
              'target-arrow-color': '#7dd3fc',
            },
          },
          {
            selector: 'edge.dim',
            style: {
              opacity: 0.05,
              'line-opacity': 0.05,
            },
          },
        ],
        layout: {
          name: 'preset',
          fit: false,
          padding: FIT_PADDING,
          animate: false,
        },
      });

      cyRef.current = cy;

      cy.on('mouseover', 'node, edge', (evt) => {
        evt.target.addClass('hovered');
      });

      cy.on('mouseout', 'node, edge', (evt) => {
        evt.target.removeClass('hovered');
      });

      cy.on('tap', 'node', (evt) => {
        setStatus(formatNodeStatus(evt.target));
      });

      cy.on('tap', 'edge', (evt) => {
        setStatus(formatEdgeStatus(evt.target));
      });

      cy.on('tap', (evt) => {
        if (evt.target === cy) {
          setStatus(DEFAULT_STATUS);
        }
      });

      cy.ready(() => {
        fitGraph(FIT_PADDING);
        window.setTimeout(() => {
          if (cyRef.current !== cy) return;
          fitGraph(FIT_PADDING);
        }, 60);
      });
    } catch (renderError) {
      setError(renderError instanceof Error ? renderError.message : String(renderError));
    }

    return () => {
      destroyCy();
    };
  }, [authLoading, user, graphData, destroyCy, fitGraph]);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return undefined;

    window.clearTimeout(searchDebounce.current);
    searchDebounce.current = window.setTimeout(() => {
      const q = search.trim().toLowerCase();
      cy.batch(() => {
        cy.elements().removeClass('dim search-hit search-neighbor');
        if (!q) {
          setStatus(DEFAULT_STATUS);
          return;
        }

        const match = cy
          .nodes()
          .filter((node) => String(node.data('label') || '').toLowerCase().includes(q));

        if (match.length === 0) {
          setStatus(`没有找到包含“${search.trim()}”的节点。`);
          return;
        }

        const neighborhood = match.closedNeighborhood();
        cy.elements().difference(neighborhood).addClass('dim');
        match.addClass('search-hit');
        neighborhood.difference(match).addClass('search-neighbor');
        setStatus(`搜索结果：高亮 ${match.length} 个节点，并保留其一阶邻域关系。`);
      });
    }, 220);

    return () => window.clearTimeout(searchDebounce.current);
  }, [search, graphData]);

  useEffect(() => {
    const onResize = () => {
      fitGraph(FIT_PADDING);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [fitGraph]);

  const handleFit = () => {
    fitGraph(FIT_PADDING);
  };

  if (authLoading || !user) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-slate-950 text-slate-300 text-xl">
        正在加载...
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.9),_transparent_18%),radial-gradient(circle_at_top_right,_rgba(254,240,138,0.32),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(125,211,252,0.34),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(251,207,232,0.34),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#eef6ff_38%,_#fef3f2_72%,_#fefce8_100%)] text-slate-800">
      <header className="shrink-0 border-b border-white/60 bg-white/55 px-3 py-3 backdrop-blur-xl sm:px-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/help')}
            className="shrink-0 rounded-xl border border-sky-200/80 bg-white/75 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-400/60 hover:bg-white"
          >
            返回帮助中心
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-semibold tracking-[0.02em] text-slate-800 sm:text-lg">
              {title}
            </h1>
            <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-sky-600/70">
              Knowledge Graph Workspace
            </p>
          </div>
          {debugCount != null && (
            <span className="rounded-full border border-sky-200/80 bg-white/70 px-3 py-1 text-[11px] font-medium tabular-nums text-sky-700">
              已载入 {debugCount} 个图谱元素
            </span>
          )}
          <button
            type="button"
            onClick={handleFit}
            className="rounded-xl border border-slate-600/80 bg-slate-900/90 px-3 py-2 text-sm font-medium text-slate-100 transition hover:border-sky-400/50 hover:bg-slate-800"
          >
            适应画布
          </button>
        </div>
        <div className="mt-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="按节点名称筛选图谱..."
            className="w-full rounded-xl border border-white/70 bg-white/75 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50"
          />
        </div>
      </header>

      <div
        className="relative w-full shrink-0 overflow-hidden border-y border-white/60 bg-[radial-gradient(circle_at_top_left,_rgba(125,211,252,0.22),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(251,207,232,0.24),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(167,243,208,0.2),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(253,224,71,0.2),_transparent_26%),linear-gradient(180deg,_rgba(255,255,255,0.74)_0%,_rgba(239,246,255,0.8)_40%,_rgba(254,242,242,0.78)_72%,_rgba(254,249,195,0.72)_100%)]"
        style={{ height: 'calc(100dvh - 8.75rem)', minHeight: CANVAS_MIN_HEIGHT }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(148,163,184,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.1)_1px,transparent_1px)] [background-size:36px_36px]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/50 via-sky-100/35 to-transparent" />
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 text-lg text-slate-700 backdrop-blur-sm">
            正在加载图谱...
          </div>
        )}
        {error && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-white/80 p-6 text-center backdrop-blur-sm">
            <p className="max-w-md text-red-300">{error}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-xl bg-sky-600 px-4 py-2 text-sm text-white transition hover:bg-sky-500"
              >
                重试
              </button>
              <button
                type="button"
                onClick={() => navigate('/help')}
                className="rounded-xl border border-sky-200 bg-white/70 px-4 py-2 text-sm text-slate-700 transition hover:bg-white"
              >
                返回
              </button>
            </div>
          </div>
        )}
        <div ref={hostRef} className="h-full w-full" style={{ minHeight: CANVAS_MIN_HEIGHT }} />
      </div>

      <footer className="shrink-0 border-t border-white/60 bg-white/45 px-3 py-3 backdrop-blur-xl sm:px-4">
        <div className="rounded-2xl border border-white/70 bg-white/72 px-4 py-3 shadow-[0_12px_40px_rgba(148,163,184,0.16)]">
          <p className="text-[11px] uppercase tracking-[0.22em] text-sky-600/70">Inspector</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-700">{status}</p>
          <p className="mt-2 text-[11px] text-slate-500">
            如果画布内容偏离视野，可点击“适应画布”；图谱数据来源于 public/kg-graph.json。
          </p>
        </div>
      </footer>
    </div>
  );
};

export default KnowledgeGraphPage;





