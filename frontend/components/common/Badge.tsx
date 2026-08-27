'use client';

import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'danger' | 'primary' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export default function Badge({ label, variant = 'primary', size = 'md', dot = false }: BadgeProps) {
  const styles: Record<string, { bg: string; text: string; border: string; dotColor: string }> = {
    success: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0', dotColor: '#22c55e' },
    warning: { bg: '#fffbeb', text: '#92400e', border: '#fde68a', dotColor: '#f59e0b' },
    danger: { bg: '#fef2f2', text: '#991b1b', border: '#fecaca', dotColor: '#ef4444' },
    primary: { bg: '#f0f4ff', text: '#4338ca', border: '#c7d2fe', dotColor: '#667eea' },
    neutral: { bg: '#f9fafb', text: '#374151', border: '#e5e7eb', dotColor: '#9ca3af' },
  };

  const s = styles[variant];
  const padding = size === 'sm' ? '3px 8px' : '5px 12px';
  const fontSize = size === 'sm' ? '11px' : '13px';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: s.bg,
        color: s.text,
        border: `1px solid ${s.border}`,
        borderRadius: 9999,
        padding,
        fontSize,
        fontWeight: 600,
        letterSpacing: '0.02em',
      }}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: s.dotColor,
            flexShrink: 0,
          }}
        />
      )}
      {label}
    </span>
  );
}
