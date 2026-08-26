'use client';

import React, { useEffect, useState } from 'react';
import Badge from '@/components/common/Badge';

interface ScoreCardProps {
  score: number;
  status: 'Highly Qualified' | 'Partially Qualified' | 'Not Qualified';
}

export default function ScoreCard({ score, status }: ScoreCardProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const start = Date.now();
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(animate);
    };
    const timer = setTimeout(() => requestAnimationFrame(animate), 300);
    return () => clearTimeout(timer);
  }, [score]);

  const statusConfig = {
    'Highly Qualified': {
      color: '#10b981',
      gradientStart: '#10b981',
      gradientEnd: '#059669',
      badge: 'success' as const,
      ringColor: '#10b981',
      bgGlow: 'rgba(16,185,129,0.1)',
      emoji: '🏆',
    },
    'Partially Qualified': {
      color: '#f59e0b',
      gradientStart: '#f59e0b',
      gradientEnd: '#d97706',
      badge: 'warning' as const,
      ringColor: '#f59e0b',
      bgGlow: 'rgba(245,158,11,0.1)',
      emoji: '⭐',
    },
    'Not Qualified': {
      color: '#ef4444',
      gradientStart: '#ef4444',
      gradientEnd: '#dc2626',
      badge: 'danger' as const,
      ringColor: '#ef4444',
      bgGlow: 'rgba(239,68,68,0.1)',
      emoji: '📋',
    },
  };

  const cfg = statusConfig[status];
  const circumference = 2 * Math.PI * 70;
  const offset = circumference * (1 - score / 100);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 32px',
        background: 'white',
        borderRadius: 24,
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="animate-scaleIn"
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at center, ${cfg.bgGlow} 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 24 }}>
        Lead Qualification Score
      </p>

      {/* Score ring */}
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <svg width={170} height={170} viewBox="0 0 170 170">
          {/* Background ring */}
          <circle cx={85} cy={85} r={70} fill="none" stroke="#f0f0f0" strokeWidth={12} />
          {/* Score ring */}
          <circle
            cx={85} cy={85} r={70}
            fill="none"
            stroke={cfg.ringColor}
            strokeWidth={12}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - displayScore / 100)}
            strokeLinecap="round"
            transform="rotate(-90 85 85)"
            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)', filter: `drop-shadow(0 0 8px ${cfg.ringColor}50)` }}
          />
        </svg>

        {/* Center content */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 10, marginBottom: 4 }}>{cfg.emoji}</span>
          <span style={{
            fontSize: 46,
            fontWeight: 900,
            color: cfg.color,
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.03em',
          }}>
            {displayScore}
          </span>
          <span style={{ fontSize: 16, color: 'var(--text-muted)', fontWeight: 500 }}>/100</span>
        </div>
      </div>

      {/* Status badge */}
      <div style={{ marginBottom: 12 }}>
        <Badge label={status} variant={cfg.badge} dot size="md" />
      </div>

      {/* Description */}
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 220 }}>
        {status === 'Highly Qualified'
          ? 'This lead is primed for conversion. Schedule a consultation immediately.'
          : status === 'Partially Qualified'
          ? 'Good potential. A few more details could strengthen this lead.'
          : 'This lead needs more nurturing before direct outreach.'
        }
      </p>
    </div>
  );
}
