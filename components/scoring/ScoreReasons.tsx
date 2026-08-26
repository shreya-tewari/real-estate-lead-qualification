'use client';

import React from 'react';
import { Check, X } from 'lucide-react';
import { ScoreReason } from '@/types/Lead';

interface ScoreReasonsProps {
  reasons: ScoreReason[];
}

export default function ScoreReasons({ reasons }: ScoreReasonsProps) {
  const achieved = reasons.filter(r => r.achieved);
  const missed = reasons.filter(r => !r.achieved);

  return (
    <div style={{ background: 'white', borderRadius: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden', border: '1px solid var(--border)' }}>
      <div style={{ padding: '18px 24px', borderBottom: '1px solid #f5f5f5' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Score Breakdown</h3>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>What contributed to this score</p>
      </div>

      <div style={{ padding: '16px 24px' }}>
        {/* Achieved */}
        <p style={{ fontSize: 12, fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          ✓ Positive Signals
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {achieved.map((r, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                background: '#f0fdf4',
                borderRadius: 10,
                border: '1px solid #bbf7d0',
                animation: `fadeInUp 0.3s ease ${i * 0.05}s both`,
              }}
            >
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Check size={13} color="white" />
              </div>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#15803d' }}>{r.label}</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#10b981' }}>+{r.points}</span>
            </div>
          ))}
        </div>

        {/* Missed (if any) */}
        {missed.length > 0 && (
          <>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              ✗ Improvement Areas
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {missed.map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 14px',
                    background: '#fff5f5',
                    borderRadius: 10,
                    border: '1px solid #fecaca',
                    animation: `fadeInUp 0.3s ease ${(achieved.length + i) * 0.05}s both`,
                  }}
                >
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <X size={13} color="white" />
                  </div>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#991b1b' }}>{r.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#ef4444' }}>-{r.points}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
