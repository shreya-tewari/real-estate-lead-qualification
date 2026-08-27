'use client';

import React from 'react';
import { QualificationData } from '@/types/Lead';
import { User, DollarSign, MapPin, Home, Clock, CreditCard, Target, Mail, Phone } from 'lucide-react';

interface QualificationSummaryProps {
  data: QualificationData;
}

const rows: { key: keyof QualificationData; label: string; icon: React.ReactNode }[] = [
  { key: 'name', label: 'Lead Name', icon: <User size={15} /> },
  { key: 'email', label: 'Email', icon: <Mail size={15} /> },
  { key: 'phone', label: 'Phone', icon: <Phone size={15} /> },
  { key: 'buyerType', label: 'Buyer Type', icon: <Target size={15} /> },
  { key: 'budget', label: 'Budget', icon: <DollarSign size={15} /> },
  { key: 'location', label: 'Location', icon: <MapPin size={15} /> },
  { key: 'propertyType', label: 'Property Type', icon: <Home size={15} /> },
  { key: 'timeline', label: 'Timeline', icon: <Clock size={15} /> },
  { key: 'financing', label: 'Financing', icon: <CreditCard size={15} /> },
  { key: 'purpose', label: 'Investment Purpose', icon: <Target size={15} /> },
];

export default function QualificationSummary({ data }: QualificationSummaryProps) {
  return (
    <div style={{ background: 'white', borderRadius: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden', border: '1px solid var(--border)' }}>
      <div style={{ padding: '18px 24px', background: 'var(--gradient)', color: 'white' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Qualification Summary</h3>
        <p style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>Collected from AI conversation</p>
      </div>
      <div>
        {rows.map((row, i) => {
          const value = data[row.key];
          return (
            <div
              key={row.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '14px 24px',
                borderBottom: i < rows.length - 1 ? '1px solid #f5f5f5' : 'none',
                gap: 12,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#fafbff')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--gradient-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                {row.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {row.label}
                </p>
                <p style={{ fontSize: 14, fontWeight: 600, color: value ? 'var(--text-primary)' : 'var(--text-muted)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {value || '—'}
                </p>
              </div>
              {value && (
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
