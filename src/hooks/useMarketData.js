import { useState, useEffect } from 'react';
import { subscribeToMarket } from '../data/marketData';

export function useMarketData() {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToMarket(setAssets);
    return unsubscribe;
  }, []);

  return assets;
}
