import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Check, Receipt, Download, Star } from 'lucide-react';
import { billingData } from '../data/userData';

export default function Billing() {
  const [selectedPlan, setSelectedPlan] = useState(billingData.plan);
  const data = billingData;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="text-3xl font-semibold tracking-tight" style={{ marginBottom: '8px' }}>Billing & Subscription</h1>
        <p className="text-sm" style={{ color: 'var(--color-text-dim)' }}>Manage your plan and payment details</p>
      </div>

      {/* Current Plan */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="panel" style={{ padding: '28px', marginBottom: '24px', borderLeft: '3px solid var(--color-accent)' }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center" style={{ gap: '10px', marginBottom: '8px' }}>
              <h2 className="text-lg font-semibold">{data.plan} Plan</h2>
              <span className="text-xs font-semibold" style={{ padding: '3px 10px', borderRadius: '999px', background: 'var(--color-accent-soft)', color: 'var(--color-accent)' }}>Active</span>
            </div>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{data.price} · {data.billingCycle} billing</p>
            <p className="text-xs" style={{ color: 'var(--color-text-dim)', marginTop: '4px' }}>Next billing: {data.nextBillingDate}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="flex items-center" style={{ gap: '8px' }}>
              <CreditCard style={{ width: '16px', height: '16px', color: 'var(--color-text-dim)' }} />
              <span className="text-sm font-medium">{data.paymentMethod.brand} ···· {data.paymentMethod.last4}</span>
            </div>
            <p className="text-xs" style={{ color: 'var(--color-text-dim)', marginTop: '4px' }}>Expires {data.paymentMethod.expiry}</p>
          </div>
        </div>
      </motion.div>

      {/* Plans */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {data.plans.map((plan, idx) => (
          <motion.div key={plan.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
            className="panel" style={{
              padding: '28px', position: 'relative', overflow: 'hidden',
              border: plan.name === data.plan ? '2px solid var(--color-accent)' : undefined,
            }}>
            {plan.popular && (
              <div className="flex items-center" style={{
                position: 'absolute', top: '12px', right: '-28px', transform: 'rotate(45deg)',
                padding: '3px 36px', background: 'var(--color-accent)', color: '#fff', fontSize: '9px', fontWeight: 700,
              }}>POPULAR</div>
            )}
            <div style={{ marginBottom: '20px' }}>
              <h3 className="text-lg font-semibold" style={{ marginBottom: '4px' }}>{plan.name}</h3>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>{plan.price}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {plan.features.map((f) => (
                <div key={f} className="flex items-center" style={{ gap: '8px' }}>
                  <Check style={{ width: '14px', height: '14px', color: 'var(--color-green)', flexShrink: 0 }} />
                  <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{f}</span>
                </div>
              ))}
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full text-xs font-semibold cursor-pointer"
              style={{
                padding: '12px', borderRadius: '12px', border: 'none',
                background: plan.name === data.plan ? 'var(--color-surface-active)' : plan.popular ? 'var(--color-accent)' : 'var(--color-surface)',
                color: plan.name === data.plan ? 'var(--color-text-dim)' : plan.popular ? '#fff' : 'var(--color-text-muted)',
              }}>
              {plan.name === data.plan ? 'Current Plan' : 'Upgrade'}
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Invoices */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="panel" style={{ padding: '28px' }}>
        <span className="section-label">Invoice History</span>
        <div style={{ marginTop: '20px' }}>
          <div className="grid grid-cols-4" style={{ gap: '16px', padding: '0 0 10px', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-dim)' }}>
            <span>Invoice</span>
            <span>Date</span>
            <span style={{ textAlign: 'right' }}>Amount</span>
            <span style={{ textAlign: 'right' }}>Status</span>
          </div>
          {data.invoices.map((inv) => (
            <div key={inv.id} className="grid grid-cols-4 items-center" style={{ gap: '16px', padding: '12px 0', borderTop: '1px solid var(--color-border)' }}>
              <span className="text-sm font-medium">{inv.id}</span>
              <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{inv.date}</span>
              <span className="text-sm font-medium" style={{ textAlign: 'right' }}>${inv.amount.toFixed(2)}</span>
              <div style={{ textAlign: 'right' }} className="flex items-center justify-end" >
                <span className="text-xs font-semibold" style={{ padding: '3px 10px', borderRadius: '999px', background: 'var(--color-green-soft)', color: 'var(--color-green)' }}>
                  {inv.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
