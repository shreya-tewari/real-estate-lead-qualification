'use client';

import React from 'react';
import { Check, Circle, User, DollarSign, MapPin, Home, Clock, CreditCard, Target, Mail } from 'lucide-react';
import { QualificationData } from '@/types/Lead';

interface QualificationProgressProps {
  data: QualificationData;
}

interface QualField {
  key: keyof QualificationData;
  label: string;
  icon: React.ReactNode;
  points: number;
}

const fields: QualField[] = [
  { key: 'name', label: 'Full Name', icon: <User size={14} />, points: 5 },
  { key: 'email', label: 'Email Address', icon: <Mail size={14} />, points: 10 },
  { key: 'buyerType', label: 'Buyer Type', icon: <Target size={14} />, points: 15 },
  { key: 'budget', label: 'Budget Range', icon: <DollarSign size={14} />, points: 20 },
  { key: 'location', label: 'Preferred Location', icon: <MapPin size={14} />, points: 15 },
  { key: 'propertyType', label: 'Property Type', icon: <Home size={14} />, points: 15 },
  { key: 'timeline', label: 'Purchase Timeline', icon: <Clock size={14} />, points: 10 },
  { key: 'financing', label: 'Financing Method', icon: <CreditCard size={14} />, points: 10 },
];

export default function QualificationProgress({ data }: QualificationProgressProps) {
  const completedFields = fields.filter(f => !!data[f.key]);
  const totalPoints = fields.reduce((s, f) => s + f.points, 0);
  const earnedPoints = completedFields.reduce((s, f) => s + f.points, 0);
  const percentage = Math.round((earnedPoints / totalPoints) * 100);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Progress ring + percentage */}
      <div style={{ textAlign: 'center', padding: '20px 0 12px' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <svg width={100} height={100} viewBox="0 0 100 100">
            <circle cx={50} cy={50} r={42} fill="none" stroke="#f0f0f0" strokeWidth={8} />
            <circle
              cx={50} cy={50} r={42}
              fill="none"
              stroke="url(#progressGrad)"
              strokeWidth={8}
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - percentage / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
            <defs>
              <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#667eea" />
                <stop offset="100%" stopColor="#764ba2" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>{percentage}%</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>complete</span>
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
            {completedFields.length}/{fields.length} Fields Collected
          </p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            {percentage < 40 ? 'Getting started...' : percentage < 70 ? 'Good progress!' : percentage < 100 ? 'Almost done!' : '✓ Fully qualified!'}
          </p>
        </div>
      </div>

      {/* Field checklist */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 8 }} className="scrollbar-thin">
        {fields.map((field, i) => {
          const isDone = !!data[field.key];
          const value = data[field.key];
          return (
            <div
              key={field.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 10,
                marginBottom: 6,
                background: isDone ? 'linear-gradient(135deg, #f0f4ff, #faf5ff)' : '#f9f9f9',
                border: `1px solid ${isDone ? 'rgba(102,126,234,0.2)' : 'transparent'}`,
                transition: 'all 0.3s ease',
                animation: `fadeInUp 0.3s ease ${i * 0.05}s both`,
              }}
            >
              {/* Status icon */}
              <div style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: isDone ? 'var(--gradient)' : 'white',
                border: `2px solid ${isDone ? 'transparent' : '#e5e7eb'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.3s ease',
              }}>
                {isDone ? <Check size={12} color="white" /> : <Circle size={12} color="#d1d5db" />}
              </div>

              {/* Label + value */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: isDone ? 'var(--primary)' : 'var(--text-muted)' }}>
                  {field.label}
                </p>
                {isDone && value && (
                  <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {value}
                  </p>
                )}
              </div>

              {/* Points */}
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                color: isDone ? 'var(--primary)' : '#d1d5db',
                background: isDone ? 'rgba(102,126,234,0.1)' : 'transparent',
                padding: '2px 6px',
                borderRadius: 6,
              }}>
                +{field.points}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar at bottom */}
      <div style={{ padding: '0 4px 4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>Qualification Progress</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)' }}>{earnedPoints}/{totalPoints} pts</span>
        </div>
        <div style={{ height: 6, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${percentage}%`,
            background: 'var(--gradient)',
            borderRadius: 3,
            transition: 'width 0.6s ease',
          }} />
        </div>
      </div>
    </div>
  );
}
