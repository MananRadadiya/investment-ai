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
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
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
