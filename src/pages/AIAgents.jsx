import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Shield, Crosshair, Zap, Play, Square, Settings2, ChevronDown, ChevronUp, Terminal, RotateCcw, Sparkles, Clock, Activity } from 'lucide-react';
import { runAgentPipeline, runSingleAgent } from '../agents';
import PipelineVisualizer from '../components/agents/PipelineVisualizer';
import MarketResults from '../components/agents/MarketResults';
import RiskResults from '../components/agents/RiskResults';
import StrategyResults from '../components/agents/StrategyResults';
import ExecutionResults from '../components/agents/ExecutionResults';
import AgentHistory, { saveToHistory } from '../components/agents/AgentHistory';

const agentsMeta = [
  {
    name: 'Market Agent',
    icon: Cpu,
    description: 'Scans and analyzes market trends, identifies momentum, calculates Fear & Greed index',
    color: '#4f8cff',
    gradient: 'linear-gradient(135deg, #4f8cff, #3b7ff5)',
    resultKey: 'market',
  },
  {
    name: 'Risk Agent',
    icon: Shield,
    description: 'Calculates portfolio risk score, volatility, VaR, Sharpe ratio, and drawdown estimates',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    resultKey: 'risk',
  },
  {
    name: 'Strategy Agent',
    icon: Crosshair,
    description: 'Creates optimal asset allocation with diversification scoring and rebalancing advice',
    color: '#22c55e',
    gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
    resultKey: 'strategy',
  },
  {
    name: 'Execution Agent',
    icon: Zap,
    description: 'Simulates trade execution with realistic slippage, fees, fill prices, and P&L projections',
    color: '#a78bfa',
    gradient: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
    resultKey: 'execution',
  },
];

const ResultComponent = {
  market: MarketResults,
  risk: RiskResults,
  strategy: StrategyResults,
  execution: ExecutionResults,
};

export default function AIAgents() {
  // Global state
  const [logs, setLogs] = useState([]);
  const [isPipelineRunning, setIsPipelineRunning] = useState(false);
  const [pipelineResult, setPipelineResult] = useState(null);
  const [activeAgent, setActiveAgent] = useState(null);
  const [completedAgents, setCompletedAgents] = useState([]);

  // Per-agent state
  const [agentResults, setAgentResults] = useState({});
  const [agentRunning, setAgentRunning] = useState({});
  const [agentLogs, setAgentLogs] = useState({});
  const [expandedAgent, setExpandedAgent] = useState(null);

  // Configuration
  const [investmentAmount, setInvestmentAmount] = useState(50000);
  const [riskLevel, setRiskLevel] = useState('moderate');
  const [showConfig, setShowConfig] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);

  // History refresh key
  const [historyKey, setHistoryKey] = useState(0);

  // Stats
  const [totalRuns, setTotalRuns] = useState(() => {
    try { return parseInt(localStorage.getItem('ai-agent-total-runs') || '0'); } catch { return 0; }
  });

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

  // Run individual agent
  const handleRunSingle = useCallback(async (agentName, resultKey) => {
    setAgentRunning((p) => ({ ...p, [resultKey]: true }));
    setAgentLogs((p) => ({ ...p, [resultKey]: [] }));
    setAgentResults((p) => ({ ...p, [resultKey]: null }));
    setExpandedAgent(resultKey);

    try {
      const result = await runSingleAgent(agentName, { riskLevel, investmentAmount });
      setAgentResults((p) => ({ ...p, [resultKey]: result[resultKey] }));
      setAgentLogs((p) => ({ ...p, [resultKey]: result[resultKey]?.logs || [] }));
    } catch (err) {
      setAgentLogs((p) => ({ ...p, [resultKey]: [`Error: ${err.message}`] }));
    }

    setAgentRunning((p) => ({ ...p, [resultKey]: false }));
  }, [riskLevel, investmentAmount]);

  // Run full pipeline
  const handleRunAll = useCallback(async () => {
    setIsPipelineRunning(true);
    setLogs([]);
    setPipelineResult(null);
    setAgentResults({});
    setActiveAgent(null);
    setCompletedAgents([]);

    const agentNames = ['Market Agent', 'Risk Agent', 'Strategy Agent', 'Execution Agent'];
    let currentIdx = -1;

    const res = await runAgentPipeline(investmentAmount, riskLevel, (log) => {
      if (log.isHeader && log.agent) {
        if (log.agent === 'done') {
          setActiveAgent(null);
          setCompletedAgents([...agentNames]);
          return;
        }
        const idx = agentNames.indexOf(log.agent);
        if (idx >= 0) {
          // Mark previous as completed
          if (currentIdx >= 0) {
            setCompletedAgents((prev) => [...prev, agentNames[currentIdx]]);
          }
          currentIdx = idx;
          setActiveAgent(log.agent);
        }
      }
      setLogs((prev) => [...prev, log]);
    });

    setPipelineResult(res);
    setAgentResults({
      market: res.market,
      risk: res.risk,
      strategy: res.strategy,
      execution: res.execution,
    });
    setExpandedAgent('market');

    // Save to history
    saveToHistory(res);
    setHistoryKey((k) => k + 1);
    const newTotal = totalRuns + 1;
    setTotalRuns(newTotal);
    localStorage.setItem('ai-agent-total-runs', String(newTotal));

    setIsPipelineRunning(false);
    setActiveAgent(null);
  }, [investmentAmount, riskLevel, totalRuns]);

  const isAnyRunning = isPipelineRunning || Object.values(agentRunning).some(Boolean);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* ───── HERO HEADER ───── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #4f8cff, #a78bfa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles style={{ width: '20px', height: '20px', color: '#fff' }} />
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-text)' }}>
              AI Agent Command Center
            </h1>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--color-text-dim)', maxWidth: '480px', lineHeight: 1.6 }}>
            Run agents independently for focused analysis or orchestrate the full pipeline: analyze → assess → strategize → execute
          </p>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', padding: '8px 16px' }}>
            <p style={{ fontSize: '18px', fontWeight: 800, color: '#4f8cff' }}>{totalRuns}</p>
            <p style={{ fontSize: '9px', fontWeight: 600, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Runs</p>
          </div>
          <div style={{ width: '1px', height: '32px', background: 'var(--color-border)' }} />
          <div style={{ textAlign: 'center', padding: '8px 16px' }}>
            <p style={{ fontSize: '18px', fontWeight: 800, color: '#22c55e' }}>4</p>
            <p style={{ fontSize: '9px', fontWeight: 600, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Agents</p>
          </div>
        </div>
      </div>

      {/* ───── CONFIGURATION + RUN ALL ───── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px', borderRadius: '16px', background: 'var(--color-surface)',
        marginBottom: '20px', gap: '16px',
      }}>
        {/* Config Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
          <button
            onClick={() => setShowConfig(!showConfig)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', borderRadius: '10px',
              background: showConfig ? 'var(--color-accent-soft)' : 'transparent',
              border: '1px solid var(--color-border)', color: 'var(--color-text-muted)',
              fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 150ms',
            }}
          >
            <Settings2 style={{ width: '14px', height: '14px' }} />
            Config
          </button>

          <AnimatePresence>
            {showConfig && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--color-text-dim)', fontWeight: 600, whiteSpace: 'nowrap' }}>Investment</label>
                  <input
                    type="number" value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(Number(e.target.value) || 0)}
                    style={{
                      width: '110px', padding: '6px 10px', borderRadius: '8px',
                      background: 'var(--color-input-bg)', border: '1px solid var(--color-border)',
                      color: 'var(--color-text)', fontSize: '12px', fontWeight: 600,
                    }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {['conservative', 'moderate', 'aggressive'].map((level) => (
                    <button key={level} onClick={() => setRiskLevel(level)}
                      style={{
                        padding: '5px 12px', borderRadius: '8px', border: 'none',
                        background: riskLevel === level ? '#4f8cff' : 'var(--color-surface-hover)',
                        color: riskLevel === level ? '#fff' : 'var(--color-text-muted)',
                        fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                        transition: 'all 150ms', textTransform: 'capitalize',
                      }}
                    >{level}</button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Inline config badges when collapsed */}
          {!showConfig && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-dim)', fontWeight: 600 }}>
                ${investmentAmount.toLocaleString()} · <span style={{ textTransform: 'capitalize' }}>{riskLevel}</span>
              </span>
            </div>
          )}
        </div>

        {/* Run All Button */}
        <motion.button
          onClick={handleRunAll}
          disabled={isAnyRunning}
          whileHover={{ scale: isAnyRunning ? 1 : 1.02 }}
          whileTap={{ scale: isAnyRunning ? 1 : 0.98 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 24px', borderRadius: '12px', border: 'none',
            background: isAnyRunning ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #4f8cff, #3b7ff5)',
            color: isAnyRunning ? 'var(--color-text-dim)' : '#fff',
            fontSize: '13px', fontWeight: 700, cursor: isAnyRunning ? 'not-allowed' : 'pointer',
            transition: 'all 200ms',
            boxShadow: isAnyRunning ? 'none' : '0 4px 20px rgba(79,140,255,0.3)',
          }}
        >
          {isPipelineRunning ? (
            <>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                <Activity style={{ width: '15px', height: '15px' }} />
              </motion.div>
              Running Pipeline...
            </>
          ) : (
            <>
              <Play style={{ width: '15px', height: '15px' }} />
              Run All Agents
            </>
          )}
        </motion.button>
      </div>

      {/* ───── PIPELINE VISUALIZER ───── */}
      <PipelineVisualizer
        activeAgent={activeAgent}
        completedAgents={completedAgents}
        isRunning={isPipelineRunning}
      />

      {/* ───── AGENT CARDS GRID ───── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {agentsMeta.map((agent, idx) => {
          const isActive = activeAgent === agent.name;
          const isSoloRunning = agentRunning[agent.resultKey];
          const hasResult = !!agentResults[agent.resultKey];
          const isExpanded = expandedAgent === agent.resultKey;
          const ResultComp = ResultComponent[agent.resultKey];

          return (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="panel-static"
              style={{ padding: 0, overflow: 'hidden', position: 'relative' }}
            >
              {/* Active scanning line */}
              {(isActive || isSoloRunning) && (
                <motion.div
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${agent.color}, transparent)`, zIndex: 2 }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              )}

              {/* Card Header */}
              <div style={{ padding: '20px 22px 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1 }}>
                  {/* Icon */}
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '14px', flexShrink: 0,
                    background: `${agent.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${agent.color}20`,
                  }}>
                    {(isActive || isSoloRunning) ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}>
                        <agent.icon style={{ width: '20px', height: '20px', color: agent.color }} />
                      </motion.div>
                    ) : (
                      <agent.icon style={{ width: '20px', height: '20px', color: agent.color }} />
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>{agent.name}</h3>
                      {/* Status badge */}
                      <div style={{
                        padding: '2px 8px', borderRadius: '6px', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                        background: (isActive || isSoloRunning) ? `${agent.color}18` : hasResult ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)',
                        color: (isActive || isSoloRunning) ? agent.color : hasResult ? '#22c55e' : 'var(--color-text-dim)',
                      }}>
                        {(isActive || isSoloRunning) ? 'Running' : hasResult ? 'Complete' : 'Idle'}
                      </div>
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-dim)', lineHeight: 1.5 }}>{agent.description}</p>
                  </div>
                </div>

                {/* Solo Run Button */}
                <motion.button
                  onClick={() => handleRunSingle(agent.name, agent.resultKey)}
                  disabled={isAnyRunning}
                  whileHover={{ scale: isAnyRunning ? 1 : 1.08 }}
                  whileTap={{ scale: isAnyRunning ? 1 : 0.95 }}
                  style={{
                    width: '36px', height: '36px', borderRadius: '10px', border: 'none',
                    background: isSoloRunning ? `${agent.color}20` : `${agent.color}10`,
                    color: agent.color, cursor: isAnyRunning ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: isAnyRunning && !isSoloRunning ? 0.3 : 1,
                    transition: 'all 150ms', flexShrink: 0,
                  }}
                  title={`Run ${agent.name} solo`}
                >
                  {isSoloRunning ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <RotateCcw style={{ width: '14px', height: '14px' }} />
                    </motion.div>
                  ) : (
                    <Play style={{ width: '14px', height: '14px' }} />
                  )}
                </motion.button>
              </div>

              {/* Quick Result Summary */}
              {hasResult && !isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ padding: '0 22px 12px' }}
                >
                  <button
                    onClick={() => setExpandedAgent(agent.resultKey)}
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: '10px',
                      background: `${agent.color}06`, border: `1px solid ${agent.color}15`,
                      color: 'var(--color-text-muted)', fontSize: '11px',
                      cursor: 'pointer', display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', transition: 'all 150ms',
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>
                      {agent.resultKey === 'market' && `Sentiment: ${agentResults.market?.sentiment?.toUpperCase()} · Avg: ${agentResults.market?.avgChange}%`}
                      {agent.resultKey === 'risk' && `Risk: ${agentResults.risk?.riskScore}/100 · Sharpe: ${agentResults.risk?.sharpeRatio}`}
                      {agent.resultKey === 'strategy' && `Assets: ${agentResults.strategy?.allocation?.length} · Diversity: ${agentResults.strategy?.diversificationScore}/100`}
                      {agent.resultKey === 'execution' && `Trades: ${agentResults.execution?.totalTrades} · Fill: ${agentResults.execution?.fillRate}%`}
                    </span>
                    <ChevronDown style={{ width: '14px', height: '14px' }} />
                  </button>
                </motion.div>
              )}

              {/* Expanded Results */}
              <AnimatePresence>
                {isExpanded && hasResult && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ borderTop: '1px solid var(--color-border)', padding: '16px 22px 20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: agent.color }}>
                          Analysis Results
                        </span>
                        <button
                          onClick={() => setExpandedAgent(null)}
                          style={{
                            background: 'transparent', border: 'none', cursor: 'pointer',
                            color: 'var(--color-text-dim)', display: 'flex', alignItems: 'center', gap: '4px',
                            fontSize: '10px', fontWeight: 600,
                          }}
                        >
                          Collapse <ChevronUp style={{ width: '12px', height: '12px' }} />
                        </button>
                      </div>
                      <ResultComp data={agentResults[agent.resultKey]} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Solo Agent Logs (mini terminal) */}
              <AnimatePresence>
                {isSoloRunning && agentLogs[agent.resultKey] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ borderTop: '1px solid var(--color-border)', overflow: 'hidden' }}
                  >
                    <div style={{ padding: '12px 22px 16px', maxHeight: '120px', overflowY: 'auto', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                      {agentLogs[agent.resultKey].map((log, i) => (
                        <div key={i} style={{ color: 'var(--color-text-muted)', padding: '2px 0' }}>
                          <span style={{ color: agent.color, marginRight: '6px' }}>›</span>{log}
                        </div>
                      ))}
                      <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} style={{ color: agent.color }}>▋</motion.span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* ───── TERMINAL ───── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="panel-static"
        style={{ padding: 0, marginBottom: '28px', overflow: 'hidden' }}
      >
        <button
          onClick={() => setShowTerminal(!showTerminal)}
          style={{
            width: '100%', padding: '16px 24px', background: 'transparent', border: 'none',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            color: 'var(--color-text)',
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal style={{ width: '14px', height: '14px' }} />
            Pipeline Terminal
            {logs.length > 0 && (
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#4f8cff', background: 'rgba(79,140,255,0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                {logs.length} entries
              </span>
            )}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isPipelineRunning && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '999px', background: '#4f8cff' }} className="animate-pulse-soft" />
                <span style={{ fontSize: '11px', color: '#4f8cff', fontWeight: 600 }}>Processing</span>
              </div>
            )}
            {showTerminal ? <ChevronUp style={{ width: '14px', height: '14px', color: 'var(--color-text-dim)' }} /> : <ChevronDown style={{ width: '14px', height: '14px', color: 'var(--color-text-dim)' }} />}
          </div>
        </button>

        <AnimatePresence>
          {showTerminal && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              style={{ overflow: 'hidden' }}
            >
              {/* Processing bar */}
              {isPipelineRunning && (
                <motion.div
                  style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)' }}
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}

              <div ref={scrollRef} style={{ maxHeight: '300px', overflowY: 'auto', padding: '0 24px 20px', fontFamily: 'var(--font-mono)', fontSize: '11px', lineHeight: 2 }}>
                {logs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-dim)' }}>
                    <Terminal style={{ width: '24px', height: '24px', opacity: 0.2, margin: '0 auto 8px' }} />
                    <p style={{ fontSize: '12px' }}>Waiting for pipeline execution</p>
                  </div>
                ) : (
                  <>
                    {logs.map((log, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.12 }}
                        style={{
                          padding: '4px 8px', borderRadius: '6px',
                          marginTop: log.isHeader && idx > 0 ? '12px' : '1px',
                        }}
                        className={log.isHeader ? 'terminal-glow' : ''}
                      >
                        <span style={{ color: 'var(--color-text-dim)', marginRight: '10px', fontSize: '9px', userSelect: 'none' }}>
                          {new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false })}
                        </span>
                        <span style={{ color: log.isHeader ? 'var(--color-accent)' : 'var(--color-text-muted)', fontWeight: log.isHeader ? 700 : 400 }}>
                          {log.text}
                        </span>
                      </motion.div>
                    ))}
                    {isPipelineRunning && (
                      <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.2 }} style={{ padding: '4px 8px', color: 'var(--color-accent)' }}>▋</motion.span>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ───── HISTORY ───── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <AgentHistory key={historyKey} />
      </motion.div>
    </motion.div>
  );
}
