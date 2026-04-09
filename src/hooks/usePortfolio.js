import { useState, useEffect } from 'react';

const STORAGE_KEY = 'ai-invest-portfolio';

function getStoredPortfolio() {
  try {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState(() => getStoredPortfolio());

  useEffect(() => {
    try {
      if (portfolio) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // localStorage may be unavailable
    }
  }, [portfolio]);

  const savePortfolio = (data) => {
    setPortfolio({
      ...data,
      createdAt: data.createdAt || Date.now(),
      updatedAt: Date.now(),
    });
  };

  const clearPortfolio = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setPortfolio(null);
  };

  return { portfolio, savePortfolio, clearPortfolio };
}
