import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProgressProvider } from './context/ProgressContext';
import DashboardLayout from './layouts/DashboardLayout';

// ── Pages ──
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Keep existing pages that align with the new architecture
import Portfolio from './pages/Portfolio';
import Market from './pages/Market';
import AIAgents from './pages/AIAgents';
import Simulator from './pages/Simulator';
import AIChat from './pages/AIChat';
import News from './pages/News';
import Learn from './pages/Learn';
import Goals from './pages/Goals';
import Glossary from './pages/Glossary';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Help from './pages/Help';

// Existing pages kept for progressive transformation (Phase 2+)
import TransactionHistory from './pages/TransactionHistory';
import DCACalculator from './pages/DCACalculator';
import PerformanceScore from './pages/PerformanceScore';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={
        <PublicRoute><Login /></PublicRoute>
      } />

      {/* Protected dashboard routes */}
      <Route element={
        <ProtectedRoute><DashboardLayout /></ProtectedRoute>
      }>
        {/* ── Learn ── */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/glossary" element={<Glossary />} />

        {/* ── Practice ── */}
        <Route path="/simulator" element={<Simulator />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/portfolio" element={<Portfolio />} />

        {/* ── AI Mentor ── */}
        <Route path="/ai-chat" element={<AIChat />} />
        <Route path="/agents" element={<AIAgents />} />

        {/* ── Explore ── */}
        <Route path="/market" element={<Market />} />
        <Route path="/schemes" element={<Settings />} />  {/* Placeholder until Schemes page built */}
        <Route path="/mutual-funds" element={<Analytics />} />  {/* Placeholder until MF page built */}
        <Route path="/news" element={<News />} />

        {/* ── Progress ── */}
        <Route path="/progress" element={<PerformanceScore />} />  {/* Reuse until Journey page built */}
        <Route path="/achievements" element={<Analytics />} />  {/* Placeholder */}

        {/* ── Account ── */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />

        {/* Legacy routes kept for compatibility */}
        <Route path="/transactions" element={<TransactionHistory />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/dca-calculator" element={<DCACalculator />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProgressProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
