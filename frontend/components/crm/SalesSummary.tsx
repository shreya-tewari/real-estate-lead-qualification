'use client';

import React from 'react';
import { CRMData } from '@/types/Lead';
import { Sparkles, Zap, ArrowRight } from 'lucide-react';

interface SalesSummaryProps {
  crmData: CRMData;
}

export default function SalesSummary({ crmData }: SalesSummaryProps) {
  const actionItems = [
    `Contact ${crmData.lead.name || 'lead'} within 24 hours`,
    `Prepare ${crmData.lead.propertyType || 'property'} listings in ${crmData.lead.location || 'target area'}`,
    `Discuss ${crmData.lead.financing || 'financing'} options and pre-approval process`,
    crmData.appointment ? `Confirm appointment details for ${crmData.appointment.dayLabel} at ${crmData.appointment.time}` : 'Schedule a discovery call',
  ];

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #f8f0ff 0%, #eff6ff 100%)',
        borderRadius: 20,
        border: '1px solid rgba(102,126,234,0.15)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ padding: '20px 24px', background: 'var(--gradient)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={18} color="white" />
        </div>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white', margin: 0 }}>AI-Generated Sales Brief</h3>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>Powered by PropAI Intelligence</p>
        </div>
      </div>

      {/* Brief */}
      <div style={{ padding: '20px 24px' }}>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-primary)', fontWeight: 400 }}>
          {crmData.salesBrief}
        </p>

        {/* Key highlights */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
          {[
            crmData.lead.buyerType,
            crmData.lead.budget,
            crmData.lead.location,
            `Score: ${crmData.score.score}/100`,
          ].filter(Boolean).map((tag, i) => (
            <span
              key={i}
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: '4px 12px',
                background: 'white',
                border: '1px solid rgba(102,126,234,0.2)',
                borderRadius: 20,
                color: 'var(--primary)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action items */}
        <div style={{ marginTop: 20, padding: '16px', background: 'white', borderRadius: 12, border: '1px solid rgba(102,126,234,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Zap size={14} color="var(--primary)" />
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Action Items for Sales Team</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {actionItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <div style={{
                  width: 20, height: 20, background: 'var(--gradient)', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
                }}>
                  <span style={{ fontSize: 10, color: 'white', fontWeight: 700 }}>{i + 1}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
