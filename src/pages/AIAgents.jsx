import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../context/ProgressContext';
import { agentRegistry, runSingleAgent, runAgentPipeline } from '../agents';
import {
  Play, Loader2, ChevronRight, BookOpen,
  Sparkles, RotateCcw, Settings2,
} from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
};

// ─── Single Agent Card ───
function AgentCard({ agent, onRun, isRunning }) {
  return (
    <motion.div
      {...fadeIn}
      className="panel-interactive"
      onClick={() => !isRunning && onRun(agent.id)}
      style={{ padding: 'var(--space-5)', cursor: isRunning ? 'wait' : 'pointer' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
        <div style={{
          width: 44, height: 44, borderRadius: 'var(--radius-sm)',
          background: `${agent.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px', flexShrink: 0,
        }}>
          {agent.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 className="heading-tight" style={{ fontSize: 'var(--text-md)', marginBottom: 'var(--space-1)' }}>
            {agent.name}
          </h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {agent.description}
          </p>
        </div>
        <div style={{
          width: 32, height: 32, borderRadius: 'var(--radius-sm)',
          background: `${agent.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {isRunning
            ? <Loader2 style={{ width: 16, height: 16, color: agent.color, animation: 'spin 1s linear infinite' }} />
            : <Play style={{ width: 14, height: 14, color: agent.color }} />
          }
        </div>
      </div>
    </motion.div>
  );
}

// ─── Agent Result Display ───
function AgentResult({ result, agentId }) {
  if (!result) return null;

  const renderKeyValue = (label, value) => (
    <div style={{ marginBottom: 'var(--space-3)' }}>
      <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: 'var(--space-1)' }}>
        {label}
      </p>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.6 }}>
        {value}
      </p>
    </div>
  );

  // Concept Agent result
  if (agentId === 'concept' && result.concept) {
    return (
      <div>
        {renderKeyValue('Concept', result.concept)}
        {renderKeyValue('Explanation', result.explanation)}
        {renderKeyValue('Analogy', result.analogy)}
        {renderKeyValue('Indian Example', result.indianExample)}
      </div>
    );
  }

  // Risk Agent result
  if (agentId === 'risk' && result.profile) {
    return (
      <div>
        {renderKeyValue('Risk Profile', result.profile)}
        {renderKeyValue('Description', result.description)}
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: 'var(--space-2)' }}>
            Recommended Allocation
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {Object.entries(result.allocation).map(([key, value]) => (
              <div key={key} style={{
                padding: '6px 12px', borderRadius: 'var(--radius-sm)',
                background: 'var(--surface-2)', fontSize: '12px', fontWeight: 500,
              }}>
                {key.charAt(0).toUpperCase() + key.slice(1)}: {value}%
              </div>
            ))}
          </div>
        </div>
        {renderKeyValue('Instruments', result.instruments.join(' · '))}
        {renderKeyValue('Expected Return', result.expectedReturn)}
      </div>
    );
  }

  // Goal Agent result
  if (agentId === 'goal' && result.goal) {
    return (
      <div>
        {renderKeyValue('Goal', `${result.icon} ${result.goal}`)}
        {renderKeyValue('Target Amount', `₹${result.targetAmount.toLocaleString('en-IN')}`)}
        {renderKeyValue('Inflation-Adjusted', `₹${result.inflationAdjustedTarget.toLocaleString('en-IN')}`)}
        {renderKeyValue('Timeline', `${result.years} years`)}
        {renderKeyValue('Required Monthly SIP', `₹${result.requiredMonthlySIP.toLocaleString('en-IN')}/month`)}
        {renderKeyValue('Recommended Instruments', result.recommendedInstruments.join(' · '))}
      </div>
    );
  }

  // Simulation Agent result
  if (agentId === 'simulation' && result.scenarios) {
    return (
      <div>
        {renderKeyValue('Monthly SIP', `₹${result.monthlyAmount.toLocaleString('en-IN')}/month for ${result.years} years`)}
        {renderKeyValue('Total Invested', `₹${result.totalInvested.toLocaleString('en-IN')}`)}
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: 'var(--space-2)' }}>
            Scenario Comparison
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {result.scenarios.map((s) => (
              <div key={s.name} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-1)',
              }}>
                <span style={{ fontSize: '13px', color: s.color, fontWeight: 500 }}>{s.name}</span>
                <span className="mono-number" style={{ fontSize: '13px', fontWeight: 600 }}>
                  ₹{s.futureValue.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>
        {renderKeyValue('Insight', result.insight)}
      </div>
    );
  }

  // Bias Agent result
  if (agentId === 'bias' && result.detectedBiases) {
    return (
      <div>
        {result.detectedBiases.map((bias, i) => (
          <div key={i} style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-4)', background: 'var(--surface-1)', borderRadius: 'var(--radius-sm)' }}>
            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
              {bias.icon} {bias.name}
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-2)' }}>
              {bias.description}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', lineHeight: 1.5, marginBottom: 'var(--space-2)' }}>
              <strong>Real example:</strong> {bias.realWorldExample}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--color-growth)', lineHeight: 1.5 }}>
              <strong>How to overcome:</strong> {bias.howToOvercome}
            </p>
          </div>
        ))}
      </div>
    );
  }

  // Fallback: generic render
  return (
    <pre style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
      {JSON.stringify(result, null, 2)}
    </pre>
  );
}

// ═══════ MAIN COMPONENT ═══════
export default function AIAgents() {
  const [runningAgent, setRunningAgent] = useState(null);
  const [agentResults, setAgentResults] = useState({});
  const [pipelineLogs, setPipelineLogs] = useState([]);
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [pipelineResult, setPipelineResult] = useState(null);
  const [activeTab, setActiveTab] = useState('agents'); // 'agents' | 'pipeline'
  const { incrementStat } = useProgress();

  // Run a single agent
  const handleRunAgent = useCallback(async (agentId) => {
    setRunningAgent(agentId);
    try {
      const result = await runSingleAgent(agentId, {
        query: 'compound interest',
        riskTolerance: 'moderate',
        timeHorizon: 20,
        goalType: 'retirement',
        targetAmount: 5000000,
        monthlyAmount: 5000,
        years: 20,
      });
      setAgentResults((prev) => ({ ...prev, [agentId]: result.result }));
      incrementStat('simulationsRun');
    } catch (err) {
      console.error('Agent error:', err);
    }
    setRunningAgent(null);
  }, [incrementStat]);

  // Run full pipeline
  const handleRunPipeline = useCallback(async () => {
    setPipelineRunning(true);
    setPipelineLogs([]);
    setPipelineResult(null);
    try {
      const result = await runAgentPipeline(
        { monthlyAmount: 5000, years: 20, riskTolerance: 'moderate', goalType: 'retirement', targetAmount: 5000000 },
        (step) => setPipelineLogs((prev) => [...prev, step])
      );
      setPipelineResult(result);
      incrementStat('simulationsRun');
    } catch (err) {
      console.error('Pipeline error:', err);
    }
    setPipelineRunning(false);
  }, [incrementStat]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 className="heading-tight" style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-1)' }}>
          AI Mentor Hub 🤖
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
          5 educational AI agents that teach you financial concepts — they explain, never advise
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 'var(--space-1)', marginBottom: 'var(--space-6)',
        background: 'var(--surface-1)', borderRadius: 'var(--radius-sm)', padding: 2, width: 'fit-content',
      }}>
        {['agents', 'pipeline'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 20px', borderRadius: 'var(--radius-sm)',
              background: activeTab === tab ? 'var(--bg-secondary)' : 'transparent',
              border: activeTab === tab ? '1px solid var(--border-subtle)' : '1px solid transparent',
              color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-tertiary)',
              fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)',
              transition: 'all 150ms',
            }}
          >
            {tab === 'agents' ? 'Individual Agents' : 'Full Pipeline'}
          </button>
        ))}
      </div>

      {/* Individual Agents Tab */}
      {activeTab === 'agents' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {agentRegistry.map((agent) => (
            <div key={agent.id}>
              <AgentCard
                agent={agent}
                onRun={handleRunAgent}
                isRunning={runningAgent === agent.id}
              />
              {/* Result */}
              <AnimatePresence>
                {agentResults[agent.id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="panel"
                    style={{ marginTop: 'var(--space-2)', padding: 'var(--space-5)', overflow: 'hidden' }}
                  >
                    <AgentResult result={agentResults[agent.id]} agentId={agent.id} />

                    {/* What Did You Learn? */}
                    {agentResults[agent.id]?.whatDidYouLearn && (
                      <div style={{
                        marginTop: 'var(--space-4)', padding: 'var(--space-4)',
                        borderRadius: 'var(--radius-sm)', background: 'var(--color-learning-soft)',
                        border: '1px solid rgba(245, 158, 11, 0.15)',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                          <Sparkles style={{ width: 14, height: 14, color: 'var(--color-learning)' }} />
                          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-learning)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            What Did You Learn?
                          </span>
                        </div>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                          {agentResults[agent.id].whatDidYouLearn}
                        </p>
                        {agentResults[agent.id].relatedLesson && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
                            <BookOpen style={{ width: 13, height: 13, color: 'var(--color-trust)' }} />
                            <span style={{ fontSize: '12px', color: 'var(--color-trust)', fontWeight: 500 }}>
                              Explore this topic in Learning Paths →
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      {/* Pipeline Tab */}
      {activeTab === 'pipeline' && (
        <div>
          {/* Run Pipeline Button */}
          <div className="panel" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
              <div>
                <h3 className="heading-tight" style={{ fontSize: 'var(--text-md)', marginBottom: 'var(--space-1)' }}>
                  Full Educational Pipeline
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  Runs all 5 agents sequentially: Concept → Risk → Goal → Simulation → Bias Detection
                </p>
              </div>
              <button
                onClick={handleRunPipeline}
                disabled={pipelineRunning}
                className="btn-primary"
                style={{ height: 40, padding: '0 20px', fontSize: '13px', flexShrink: 0 }}
              >
                {pipelineRunning ? (
                  <>
                    <Loader2 style={{ width: 15, height: 15, animation: 'spin 1s linear infinite' }} />
                    Running...
                  </>
                ) : (
                  <>
                    <Play style={{ width: 15, height: 15 }} />
                    Run Pipeline
                  </>
                )}
              </button>
            </div>

            {/* Pipeline Parameters */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)',
            }}>
              {[
                { label: 'Monthly SIP', value: '₹5,000' },
                { label: 'Duration', value: '20 years' },
                { label: 'Risk', value: 'Moderate' },
                { label: 'Goal', value: 'Retirement' },
                { label: 'Target', value: '₹50 Lakh' },
              ].map((p) => (
                <div key={p.label} style={{
                  padding: '4px 12px', borderRadius: 'var(--radius-sm)',
                  background: 'var(--surface-2)', fontSize: '11px',
                }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>{p.label}:</span>{' '}
                  <span className="mono-number" style={{ fontWeight: 600 }}>{p.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline Log */}
          {pipelineLogs.length > 0 && (
            <div className="panel" style={{ padding: 'var(--space-5)', marginBottom: 'var(--space-4)' }}>
              <p style={{
                fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: '0.06em', color: 'var(--text-tertiary)',
                marginBottom: 'var(--space-3)',
              }}>
                Pipeline Log
              </p>
              <div style={{
                maxHeight: 300, overflowY: 'auto',
                fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: 1.8,
              }}>
                {pipelineLogs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      color: log.isHeader ? 'var(--color-trust)' : 'var(--text-secondary)',
                      fontWeight: log.isHeader ? 600 : 400,
                    }}
                  >
                    {log.text}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Pipeline Result Summary */}
          {pipelineResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="panel"
              style={{ padding: 'var(--space-6)' }}
            >
              <p style={{
                fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: '0.06em', color: 'var(--color-growth)',
                marginBottom: 'var(--space-4)',
              }}>
                ✓ Pipeline Complete — Educational Summary
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
                {/* Concept */}
                {pipelineResult.concept && (
                  <div style={{ padding: 'var(--space-4)', background: 'var(--surface-1)', borderRadius: 'var(--radius-sm)' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: 'var(--space-2)' }}>📚 {pipelineResult.concept.concept}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{pipelineResult.concept.whatDidYouLearn}</p>
                  </div>
                )}
                {/* Risk */}
                {pipelineResult.risk && (
                  <div style={{ padding: 'var(--space-4)', background: 'var(--surface-1)', borderRadius: 'var(--radius-sm)' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: 'var(--space-2)' }}>🛡️ {pipelineResult.risk.profile} Risk Profile</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{pipelineResult.risk.whatDidYouLearn}</p>
                  </div>
                )}
                {/* Goal */}
                {pipelineResult.goal && (
                  <div style={{ padding: 'var(--space-4)', background: 'var(--surface-1)', borderRadius: 'var(--radius-sm)' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: 'var(--space-2)' }}>🎯 {pipelineResult.goal.goal}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{pipelineResult.goal.whatDidYouLearn}</p>
                  </div>
                )}
                {/* Simulation */}
                {pipelineResult.simulation && (
                  <div style={{ padding: 'var(--space-4)', background: 'var(--surface-1)', borderRadius: 'var(--radius-sm)' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: 'var(--space-2)' }}>🧪 Simulation Result</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{pipelineResult.simulation.whatDidYouLearn}</p>
                  </div>
                )}
                {/* Bias */}
                {pipelineResult.bias && (
                  <div style={{ padding: 'var(--space-4)', background: 'var(--surface-1)', borderRadius: 'var(--radius-sm)' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: 'var(--space-2)' }}>🧠 Bias Awareness</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{pipelineResult.bias.whatDidYouLearn}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* CSS for spin animation */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
}
