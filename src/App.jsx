import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import AIAgents from './pages/AIAgents';
import Market from './pages/Market';
import Simulator from './pages/Simulator';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import TransactionHistory from './pages/TransactionHistory';
import News from './pages/News';
import Analytics from './pages/Analytics';
import Learn from './pages/Learn';
import Referrals from './pages/Referrals';
import Goals from './pages/Goals';
import CalendarPage from './pages/CalendarPage';
import AIChat from './pages/AIChat';
import Help from './pages/Help';
import CopyTrading from './pages/CopyTrading';
import Alerts from './pages/Alerts';
import Billing from './pages/Billing';

// AI & Intelligence
import PortfolioOptimizer from './pages/PortfolioOptimizer';
import SentimentDashboard from './pages/SentimentDashboard';
import PatternRecognition from './pages/PatternRecognition';
import RiskSimulator from './pages/RiskSimulator';
import SmartAlerts from './pages/SmartAlerts';

// Data & Visualization
import MarketHeatmap from './pages/MarketHeatmap';
import PortfolioXRay from './pages/PortfolioXRay';
import CorrelationMatrix from './pages/CorrelationMatrix';
import CandlestickChartPage from './pages/CandlestickChartPage';
import EarningsCalendar from './pages/EarningsCalendar';

// Trading & Portfolio
import PaperTrading from './pages/PaperTrading';
import Backtester from './pages/Backtester';
import DCACalculator from './pages/DCACalculator';
import TaxHarvesting from './pages/TaxHarvesting';
import DividendTracker from './pages/DividendTracker';

// Content & Education
import Tutorials from './pages/Tutorials';
import Glossary from './pages/Glossary';
import StrategyBuilder from './pages/StrategyBuilder';
import MarketReplay from './pages/MarketReplay';

// Infrastructure
import ExportImport from './pages/ExportImport';
import PerformanceScore from './pages/PerformanceScore';
import Collaboration from './pages/Collaboration';

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

function LandingRoute() {
  return <LandingPage />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Landing page — public, redirects to dashboard if logged in */}
      <Route path="/" element={<LandingRoute />} />

      <Route path="/login" element={
        <PublicRoute><Login /></PublicRoute>
      } />
      <Route element={
        <ProtectedRoute><DashboardLayout /></ProtectedRoute>
      }>
        {/* Main */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/market" element={<Market />} />
        <Route path="/transactions" element={<TransactionHistory />} />

        {/* AI Tools */}
        <Route path="/agents" element={<AIAgents />} />
        <Route path="/simulator" element={<Simulator />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/ai-chat" element={<AIChat />} />

        {/* Discover */}
        <Route path="/news" element={<News />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/copy-trading" element={<CopyTrading />} />
        <Route path="/calendar" element={<CalendarPage />} />

        {/* AI & Intelligence */}
        <Route path="/portfolio-optimizer" element={<PortfolioOptimizer />} />
        <Route path="/sentiment" element={<SentimentDashboard />} />
        <Route path="/pattern-recognition" element={<PatternRecognition />} />
        <Route path="/risk-simulator" element={<RiskSimulator />} />
        <Route path="/smart-alerts" element={<SmartAlerts />} />

        {/* Data & Visualization */}
        <Route path="/heatmap" element={<MarketHeatmap />} />
        <Route path="/portfolio-xray" element={<PortfolioXRay />} />
        <Route path="/correlation-matrix" element={<CorrelationMatrix />} />
        <Route path="/candlestick-chart" element={<CandlestickChartPage />} />
        <Route path="/earnings-calendar" element={<EarningsCalendar />} />

        {/* Trading & Portfolio */}
        <Route path="/paper-trading" element={<PaperTrading />} />
        <Route path="/backtester" element={<Backtester />} />
        <Route path="/dca-calculator" element={<DCACalculator />} />
        <Route path="/tax-harvesting" element={<TaxHarvesting />} />
        <Route path="/dividends" element={<DividendTracker />} />

        {/* Content & Education */}
        <Route path="/tutorials" element={<Tutorials />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/strategy-builder" element={<StrategyBuilder />} />
        <Route path="/market-replay" element={<MarketReplay />} />

        {/* Infrastructure */}
        <Route path="/export-import" element={<ExportImport />} />
        <Route path="/performance-score" element={<PerformanceScore />} />
        <Route path="/collaboration" element={<Collaboration />} />

        {/* Account */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/referrals" element={<Referrals />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
