import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_USER = {
  email: 'demo@aiinvest.com',
  password: 'demo1234',
  name: 'Alex Morgan',
  avatar: null,
  plan: 'Pro',
  memberSince: '2024-03-15',
  totalTrades: 847,
  successRate: 73.2,
  bestTrade: '+42.8%',
  portfolioHigh: '$284,500',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ai-invest-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (user) {
      localStorage.setItem('ai-invest-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ai-invest-user');
    }
  }, [user]);

  const login = (email, password) => {
    setLoginError('');
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      const { password: _, ...userData } = DEMO_USER;
      setUser(userData);
      return true;
    }
    setLoginError('Invalid credentials. Try the demo account!');
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loginError, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
