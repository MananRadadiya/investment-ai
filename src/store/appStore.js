import { create } from '../utils/simpleStore';

// Simple state store for app-wide state
export const useAppStore = create({
  sidebarOpen: true,
  agentLogs: [],
  agentRunning: false,
  lastAgentResult: null,
});
