import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_USER = {
  email: 'manan@bharatinvestai.in',
  password: 'demo1234',
  name: 'Manan Radadiya',
  avatar: null,
  location: 'Ahmedabad, Gujarat',
  persona: 'student',
  memberSince: '2026-08-01',
  financialLiteracyScore: null,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('bharat-investai-user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('bharat-investai-user', JSON.stringify(user));
      } else {
        localStorage.removeItem('bharat-investai-user');
      }
    } catch {
      // localStorage may be unavailable
    }
  }, [user]);

  // Standard login with email/password
  const login = (email, password) => {
    setLoginError('');
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      const { password: _, ...userData } = DEMO_USER;
      setUser(userData);
      return true;
    }
    setLoginError('Invalid credentials. Use the demo account or click "Start Demo".');
    return false;
  };

  // One-click demo login (for presentations)
  const loginAsDemo = () => {
    const { password: _, ...userData } = DEMO_USER;
    setUser(userData);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      loginAsDemo,
      logout,
      loginError,
      isAuthenticated: !!user,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
