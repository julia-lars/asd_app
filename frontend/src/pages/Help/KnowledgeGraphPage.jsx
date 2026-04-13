import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cytoscape from 'cytoscape';
import { useAuth } from '../../contexts/AuthContext';
/** 打包进 JS；更新请 npm run build:kg */
import kgGraph from '../../data/kg-graph.json';

const KnowledgeGraphPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const hostRef = useRef(null);
  const cyRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('知识图谱');
  const [status, setStatus] = useState('拖拽平移 · 滚轮缩放 · 点击节点或连线查看详情');
  const [search, setSearch] = useState('');
  const [debugCount, setDebugCount] = useState(null);
  const searchDebounce = useRef(0);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [authLoading, user, navigate]);

  const destroyCy = useCallback(() => {
    if (cyRef.current) {
      cyRef.current.destroy();
      cyRef.current = null;
    }
  }, []);

  useLayoutEffect(() => {
    if (authLoading || !user) return undefined;

    const elements = kgGraph?.elements;
    if (!Array.isArray(elements) || elements.length === 0) {
      setError('图谱数据为空，请在 frontend 目录执行 npm run build:kg');
      setLoading(false);
      setDebugCount(0);
      return undefined;
    }

    setTitle(typeof kgGraph.networkName === 'string' ? kgGraph.networkName : '知识图谱');
    setError(null);
    setLoading(true);
    setDebugCount(elements.length);

    const el = hostRef.current;
    if (!el) {
      setError('内部错误：图谱容器未挂载');
      setLoading(false);
      return undefined;
    }

    destroyCy();

    try {
      const cy = cytoscape({
        container: el,
        elements,
        wheelSensitivity: 0.18,
        minZoom: 0.02,
        maxZoom: 4,
        style: [
          {
            selector: 'node',
            style: {
              'background-color': 'data(color)',
              label: 'data(label)',
              color: '#f8fafc',
              'font-size': 9,
              'font-weight': 600,
              'text-valign': 'center',
              'text-halign': 'center',
              'text-wrap': 'wrap',
              'text-max-width': 84,
              'text-outline-width': 2,
              'text-outline-color': '#020617',
              width: 78,
              height: 32,
              padding: '8px',
              shape: 'round-rectangle',
              'border-width': 1.5,
              'border-color': '#1e293b',
            },
          },
          {
            selector: 'node:selected',
            style: {
              'border-width': 3,
              'border-color': '#38bdf8',
              'z-index': 999,
            },
          },
          {
            selector: 'node.dim',
            style: { opacity: 0.12 },
          },
          {
            selector: 'edge',
            style: {
              width: 1.2,
              'line-color': '#cbd5e1',
              'target-arrow-color': '#cbd5e1',
              'target-arrow-shape': 'triangle',
              'arrow-scale': 0.6,
              'curve-style': 'bezier',
              opacity: 0.45,
            },
          },
          {
            selector: 'edge:selected',
            style: {
              opacity: 1,
              'line-color': '#38bdf8',
              'target-arrow-color': '#38bdf8',
              width: 2.5,
            },
          },
          {
            selector: 'edge.dim',
            style: { opacity: 0.06 },
          },
        ],
        layout: { name: 'preset' },
      });

      cyRef.current = cy;

      cy.on('tap', 'node', (evt) => {
        const n = evt.target;
        const deg = n.degree(false);
        setStatus(`节点：${n.data('label')}  ·  类型：${n.data('typeTag')}  ·  连接数 ${deg}`);
      });

      cy.on('tap', 'edge', (evt) => {
        const e = evt.target;
        const src = e.source().data('label');
        const tgt = e.target().data('label');
        const rel = e.data('label') || '关联';
        setStatus(`关系：${src} —「${rel}」→ ${tgt}`);
      });

      cy.on('tap', (evt) => {
        if (evt.target === cy) {
          setStatus('拖拽平移 · 滚轮缩放 · 点击节点或连线查看详情');
        }
      });

      cy.ready(() => {
        cy.resize();
        cy.fit(undefined, 72);
        setTimeout(() => {
          if (cyRef.current !== cy) return;
          cy.resize();
          cy.fit(undefined, 72);
        }, 50);
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }

    return () => {
      destroyCy();
    };
  }, [authLoading, user, destroyCy]);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return undefined;

    window.clearTimeout(searchDebounce.current);
    searchDebounce.current = window.setTimeout(() => {
      const q = search.trim().toLowerCase();
      cy.batch(() => {
        cy.nodes().removeClass('dim');
        cy.edges().removeClass('dim');
        if (!q) return;
        const match = cy.nodes().filter((n) => String(n.data('label') || '').toLowerCase().includes(q));
        if (match.length === 0) {
          setStatus(`未找到包含「${search.trim()}」的节点`);
          return;
        }
        const hood = match.closedNeighborhood();
        cy.elements().difference(hood).addClass('dim');
        setStatus(`筛选：${match.length} 个节点及其邻域（清空搜索框恢复全图）`);
      });
    }, 220);

    return () => window.clearTimeout(searchDebounce.current);
  }, [search]);

  useEffect(() => {
    const onResize = () => {
      const cy = cyRef.current;
      if (!cy) return;
      cy.resize();
      cy.fit(undefined, 72);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleFit = () => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.resize();
    cy.fit(undefined, 72);
  };

  if (authLoading || !user) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-slate-950 text-slate-300 text-xl">
        加载中...
      </div>
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-slate-950 text-slate-100">
      <header className="shrink-0 flex flex-wrap items-center gap-3 px-3 sm:px-4 py-2.5 border-b border-slate-700/80 bg-slate-900">
        <button
          type="button"
          onClick={() => navigate('/help')}
          className="shrink-0 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700"
        >
          ← 返回帮助中心
        </button>
        <h1 className="text-base sm:text-lg font-semibold text-slate-100 truncate max-w-[min(40vw,12rem)] sm:max-w-xs">
          {title}
        </h1>
        {debugCount != null && (
          <span className="text-[11px] text-emerald-400/90 tabular-nums">已载入 {debugCount} 条图元</span>
        )}
        <div className="flex-1 min-w-[160px] basis-full sm:basis-auto order-last sm:order-none">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="按节点名称筛选…"
            className="w-full rounded-lg border border-slate-600 bg-slate-800/90 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
          />
        </div>
        <button
          type="button"
          onClick={handleFit}
          className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700"
        >
          适应画布
        </button>
      </header>

      {/* 固定像素高度，避免 flex+absolute 首帧高度为 0 导致 Cytoscape 画布不可见 */}
      <div className="relative w-full shrink-0 bg-slate-950" style={{ height: 'calc(100dvh - 7.5rem)', minHeight: 440 }}>
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/85 text-slate-300 text-lg">
            正在加载图谱…
          </div>
        )}
        {error && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-slate-950/95 p-6 text-center">
            <p className="text-red-300 max-w-md">{error}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-lg bg-sky-600 px-4 py-2 text-white text-sm hover:bg-sky-500"
              >
                重试
              </button>
              <button
                type="button"
                onClick={() => navigate('/help')}
                className="rounded-lg border border-slate-600 px-4 py-2 text-slate-200 text-sm hover:bg-slate-800"
              >
                返回
              </button>
            </div>
          </div>
        )}
        <div
          ref={hostRef}
          className="h-full w-full bg-slate-950"
          style={{ minHeight: 440 }}
        />
      </div>

      <footer className="shrink-0 border-t border-slate-700/80 bg-slate-900 px-3 py-2">
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{status}</p>
        <p className="mt-0.5 text-[10px] text-slate-600">
          若仍看不见节点：请点「适应画布」或缩小页面后刷新（数据为 src/data/kg-graph.json）
        </p>
      </footer>
    </div>
  );
};

export default KnowledgeGraphPage;
