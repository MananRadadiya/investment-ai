import { useState, useEffect, useCallback } from 'react';
import { sampleOrders, samplePositions, initialBalance } from '../data/paperTradingData';

const STORAGE_KEY = 'ai-invest-paper-trading';

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    balance: initialBalance - samplePositions.reduce((s, p) => s + p.quantity * p.avgPrice, 0),
    orders: sampleOrders,
    positions: samplePositions,
  };
}

export function usePaperTrading() {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const placeOrder = useCallback((order) => {
    const id = `ORD-${String(state.orders.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const total = order.quantity * order.price;

    // Market orders fill immediately
    const isFilled = order.type === 'market';

    const newOrder = {
      id,
      ...order,
      total: +total.toFixed(2),
      status: isFilled ? 'filled' : 'pending',
      filledAt: isFilled ? now : null,
      createdAt: now,
    };

    setState((prev) => {
      let newBalance = prev.balance;
      let newPositions = [...prev.positions];

      if (isFilled) {
        if (order.side === 'buy') {
          newBalance -= total;
          const existing = newPositions.find((p) => p.symbol === order.symbol);
          if (existing) {
            const totalQty = existing.quantity + order.quantity;
            existing.avgPrice = (existing.quantity * existing.avgPrice + total) / totalQty;
            existing.quantity = totalQty;
          } else {
            newPositions.push({
              symbol: order.symbol,
              quantity: order.quantity,
              avgPrice: order.price,
              color: order.color || '#4f8cff',
            });
          }
        } else {
          newBalance += total;
          const existing = newPositions.find((p) => p.symbol === order.symbol);
          if (existing) {
            existing.quantity -= order.quantity;
            if (existing.quantity <= 0) {
              newPositions = newPositions.filter((p) => p.symbol !== order.symbol);
            }
          }
        }
      }

      return {
        balance: +newBalance.toFixed(2),
        orders: [newOrder, ...prev.orders],
        positions: newPositions,
      };
    });

    return id;
  }, [state.orders.length]);

  const cancelOrder = useCallback((orderId) => {
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((o) =>
        o.id === orderId && o.status === 'pending'
          ? { ...o, status: 'cancelled' }
          : o
      ),
    }));
  }, []);

  const resetTrading = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      balance: initialBalance,
      orders: [],
      positions: [],
    });
  }, []);

  return {
    balance: state.balance,
    orders: state.orders,
    positions: state.positions,
    placeOrder,
    cancelOrder,
    resetTrading,
    totalEquity: state.balance + state.positions.reduce((s, p) => s + p.quantity * p.avgPrice, 0),
  };
}
