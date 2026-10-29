// ─── Bharat InvestAI — Educational Agent Pipeline ───
// 5 agents: Concept, Risk Literacy, Goal Planning, Simulation, Bias Detection

import { runConceptAgent } from './marketAgent';
import { runRiskLiteracyAgent } from './riskAgent';
import { runGoalPlanningAgent } from './strategyAgent';
import { runSimulationAgent } from './executionAgent';
import { runBiasDetectionAgent } from './biasAgent';

// Re-export individual agents
export {
  runConceptAgent,
  runRiskLiteracyAgent,
  runGoalPlanningAgent,
  runSimulationAgent,
  runBiasDetectionAgent,
};

// Agent metadata for UI display
export const agentRegistry = [
  {
    id: 'concept',
    name: 'Concept Agent',
    icon: '📚',
    description: 'Explains financial concepts with Indian examples and analogies',
    color: '#10b981',
    run: runConceptAgent,
  },
  {
    id: 'risk',
    name: 'Risk Literacy Agent',
    icon: '🛡️',
    description: 'Teaches you to understand and evaluate investment risk',
    color: '#3b82f6',
    run: runRiskLiteracyAgent,
  },
  {
    id: 'goal',
    name: 'Goal Planning Agent',
    icon: '🎯',
    description: 'Plans for life goals — wedding, house, education, retirement',
    color: '#f59e0b',
    run: runGoalPlanningAgent,
  },
  {
    id: 'simulation',
    name: 'Simulation Agent',
    icon: '🧪',
    description: 'Simulates how your investments grow over 5, 10, 20 years',
    color: '#8b5cf6',
    run: runSimulationAgent,
  },
  {
    id: 'bias',
    name: 'Bias Detection Agent',
    icon: '🧠',
    description: 'Identifies cognitive biases that hurt your financial decisions',
    color: '#ef4444',
    run: runBiasDetectionAgent,
  },
];

// Run a single agent by ID
export async function runSingleAgent(agentId, params = {}) {
  const agent = agentRegistry.find((a) => a.id === agentId);
  if (!agent) throw new Error(`Unknown agent: ${agentId}`);
  return agent.run(params);
}

// Run the full educational pipeline
export async function runAgentPipeline(params = {}, onStep) {
  const {
    monthlyAmount = 5000,
    years = 20,
    riskTolerance = 'moderate',
    goalType = 'retirement',
    targetAmount = 5000000,
  } = params;

  const allSteps = [];
  const pushStep = (step) => {
    allSteps.push(step);
    onStep?.(step);
  };

  pushStep({
    text: '▸ Starting Bharat InvestAI Educational Pipeline...',
    timestamp: Date.now(),
    isHeader: true,
    agent: 'Pipeline',
  });

  // Step 1: Concept Agent
  pushStep({ text: '▸ Initializing Concept Agent...', timestamp: Date.now(), isHeader: true, agent: 'Concept Agent' });
  const conceptResult = await runConceptAgent({ query: 'compound interest' });
  conceptResult.steps.forEach((s) => pushStep({ text: s.detail, timestamp: s.timestamp, agent: s.agent }));

  // Step 2: Risk Literacy Agent
  pushStep({ text: '▸ Initializing Risk Literacy Agent...', timestamp: Date.now(), isHeader: true, agent: 'Risk Literacy Agent' });
  const riskResult = await runRiskLiteracyAgent({ riskTolerance, timeHorizon: years });
  riskResult.steps.forEach((s) => pushStep({ text: s.detail, timestamp: s.timestamp, agent: s.agent }));

  // Step 3: Goal Planning Agent
  pushStep({ text: '▸ Initializing Goal Planning Agent...', timestamp: Date.now(), isHeader: true, agent: 'Goal Planning Agent' });
  const goalResult = await runGoalPlanningAgent({ goalType, targetAmount, years, expectedReturn: 12 });
  goalResult.steps.forEach((s) => pushStep({ text: s.detail, timestamp: s.timestamp, agent: s.agent }));

  // Step 4: Simulation Agent
  pushStep({ text: '▸ Initializing Simulation Agent...', timestamp: Date.now(), isHeader: true, agent: 'Simulation Agent' });
  const simResult = await runSimulationAgent({ monthlyAmount, years });
  simResult.steps.forEach((s) => pushStep({ text: s.detail, timestamp: s.timestamp, agent: s.agent }));

  // Step 5: Bias Detection Agent
  pushStep({ text: '▸ Initializing Bias Detection Agent...', timestamp: Date.now(), isHeader: true, agent: 'Bias Detection Agent' });
  const biasResult = await runBiasDetectionAgent({});
  biasResult.steps.forEach((s) => pushStep({ text: s.detail, timestamp: s.timestamp, agent: s.agent }));

  pushStep({
    text: '✓ All educational agents completed successfully',
    timestamp: Date.now(),
    isHeader: true,
    agent: 'done',
  });

  return {
    concept: conceptResult.result,
    risk: riskResult.result,
    goal: goalResult.result,
    simulation: simResult.result,
    bias: biasResult.result,
    logs: allSteps,
    timestamp: Date.now(),
    params,
  };
}
