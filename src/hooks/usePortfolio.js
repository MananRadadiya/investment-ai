import { useState, useEffect } from 'react';

const STORAGE_KEY = 'ai-invest-portfolio';

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (portfolio) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
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
    localStorage.removeItem(STORAGE_KEY);
    setPortfolio(null);
  };

  return { portfolio, savePortfolio, clearPortfolio };
}
