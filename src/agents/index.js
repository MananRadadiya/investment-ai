import { runMarketAgent } from './marketAgent';
import { runRiskAgent } from './riskAgent';
import { runStrategyAgent } from './strategyAgent';
import { runExecutionAgent } from './executionAgent';

// Re-export individual agents for standalone use
export { runMarketAgent, runRiskAgent, runStrategyAgent, runExecutionAgent };

// Run a single agent by name with optional params
export async function runSingleAgent(agentName, params = {}) {
  const { riskLevel = 'moderate', investmentAmount = 50000 } = params;

  switch (agentName) {
    case 'Market Agent':
      return { market: await runMarketAgent() };
    case 'Risk Agent':
      return { risk: await runRiskAgent(null, riskLevel) };
    case 'Strategy Agent':
      return { strategy: await runStrategyAgent(null, null) };
    case 'Execution Agent':
      return { execution: await runExecutionAgent(null, investmentAmount) };
    default:
      throw new Error(`Unknown agent: ${agentName}`);
  }
}

// Orchestrates all agents sequentially
export async function runAgentPipeline(investmentAmount = 50000, riskLevel = 'moderate', onLog) {
  const allLogs = [];
  const pushLogs = (logs) => {
    logs.forEach((log) => {
      allLogs.push({ text: log, timestamp: Date.now() });
      onLog?.({ text: log, timestamp: Date.now() });
    });
  };

  // Step 1: Market Agent
  onLog?.({ text: '▸ Initializing Market Agent...', timestamp: Date.now(), isHeader: true, agent: 'Market Agent' });
  const marketResult = await runMarketAgent();
  pushLogs(marketResult.logs);

  // Step 2: Risk Agent
  onLog?.({ text: '▸ Initializing Risk Agent...', timestamp: Date.now(), isHeader: true, agent: 'Risk Agent' });
  const riskResult = await runRiskAgent(marketResult, riskLevel);
  pushLogs(riskResult.logs);

  // Step 3: Strategy Agent
  onLog?.({ text: '▸ Initializing Strategy Agent...', timestamp: Date.now(), isHeader: true, agent: 'Strategy Agent' });
  const strategyResult = await runStrategyAgent(marketResult, riskResult);
  pushLogs(strategyResult.logs);

  // Step 4: Execution Agent
  onLog?.({ text: '▸ Initializing Execution Agent...', timestamp: Date.now(), isHeader: true, agent: 'Execution Agent' });
  const executionResult = await runExecutionAgent(strategyResult, investmentAmount);
  pushLogs(executionResult.logs);

  onLog?.({ text: '✓ All agents completed successfully', timestamp: Date.now(), isHeader: true, agent: 'done' });

  return {
    market: marketResult,
    risk: riskResult,
    strategy: strategyResult,
    execution: executionResult,
    logs: allLogs,
    timestamp: Date.now(),
    params: { investmentAmount, riskLevel },
  };
}
