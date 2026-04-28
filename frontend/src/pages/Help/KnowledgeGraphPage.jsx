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
              color: '#ffffff',
              'font-size': 8,
              'font-weight': 600,
              'text-valign': 'center',
              'text-halign': 'center',
              'text-wrap': 'wrap',
              'text-max-width': 56,
              'text-outline-width': 1.2,
              'text-outline-color': '#1e3a8a',
              width: 52,
              height: 24,
              padding: '4px',
              shape: 'round-rectangle',
              'border-width': 1.5,
              'border-color': '#dbeafe',
            },
          },
          {
            selector: 'node:selected',
            style: {
              'border-width': 3,
              'border-color': '#0ea5e9',
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
              'line-color': '#93c5fd',
              'target-arrow-color': '#93c5fd',
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
              'line-color': '#0284c7',
              'target-arrow-color': '#0284c7',
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
        cy.fit(undefined, 24);
        setTimeout(() => {
          if (cyRef.current !== cy) return;
          cy.resize();
          cy.fit(undefined, 24);
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
      cy.fit(undefined, 24);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleFit = () => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.resize();
    cy.fit(undefined, 24);
  };

  if (authLoading || !user) {
    return (
      <div className="flex h-[100dvh] items-center justify-center text-xl"
        style={{ background: 'rgba(250, 248, 245, 0.8)', color: 'var(--spa-muted)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--spa-accent)', borderTopColor: 'transparent' }}
          />
          加载中...
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden"
      style={{ background: 'rgba(250, 248, 245, 0.8)', color: 'var(--spa-text)' }}
    >
      <header className="shrink-0 flex items-center gap-2 px-3 py-2.5"
        style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px) saturate(140%)',
          WebkitBackdropFilter: 'blur(16px) saturate(140%)',
          borderBottom: '1px solid var(--spa-line)',
          boxShadow: '0 1px 12px rgba(28, 44, 62, 0.06)'
        }}
      >
        <button
          type="button"
          onClick={() => navigate('/help')}
          className="btn-ghost text-xs shrink-0"
          style={{ padding: '0.4rem 0.75rem' }}
        >
          返回
        </button>
        <h1 className="text-sm font-semibold truncate"
          style={{ fontFamily: '"Cormorant Garamond", "Noto Serif SC", serif', maxWidth: '8rem' }}
        >
          {title}
        </h1>
        {debugCount != null && (
          <span className="text-[10px] tabular-nums shrink-0" style={{ color: 'var(--spa-muted)' }}>
            {debugCount} 条
          </span>
        )}
        <div className="flex-1 min-w-0">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="筛选…"
            className="spa-input text-xs"
            style={{ padding: '0.4rem 0.6rem' }}
          />
        </div>
        <button
          type="button"
          onClick={handleFit}
          className="btn-primary text-xs shrink-0"
          style={{ padding: '0.4rem 0.75rem' }}
        >
          还原
        </button>
      </header>

      <div className="relative flex-1 min-h-0">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center text-lg"
            style={{ background: 'rgba(250, 248, 245, 0.85)', color: 'var(--spa-muted)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'var(--spa-accent)', borderTopColor: 'transparent' }}
              />
              正在加载图谱…
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 p-6 text-center"
            style={{ background: 'rgba(250, 248, 245, 0.95)' }}
          >
            <p className="max-w-md" style={{ color: 'var(--spa-danger)' }}>{error}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="btn-primary text-sm"
              >
                重试
              </button>
              <button
                type="button"
                onClick={() => navigate('/help')}
                className="btn-ghost text-sm"
              >
                返回
              </button>
            </div>
          </div>
        )}
        <div
          ref={hostRef}
          className="absolute inset-0 w-full h-full"
          style={{ background: 'rgba(250, 248, 245, 0.5)' }}
        />
      </div>

      <footer className="shrink-0 px-3 py-2"
        style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px) saturate(140%)',
          WebkitBackdropFilter: 'blur(16px) saturate(140%)',
          borderTop: '1px solid var(--spa-line)'
        }}
      >
        <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--spa-text)' }}>{status}</p>
        <p className="mt-0.5 text-[10px]" style={{ color: 'var(--spa-muted)' }}>
          若仍看不见节点：请点「适应画布」或缩小页面后刷新（数据为 src/data/kg-graph.json）
        </p>
      </footer>
    </div>
  );
};

export default KnowledgeGraphPage;
