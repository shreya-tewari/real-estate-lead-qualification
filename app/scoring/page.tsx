'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLead } from '@/contexts/LeadContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import Header from '@/components/layout/Header';
import ScoreCard from '@/components/scoring/ScoreCard';
import QualificationSummary from '@/components/scoring/QualificationSummary';
import ScoreReasons from '@/components/scoring/ScoreReasons';
import { ArrowRight, MessageSquare, Calendar, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ScoringPage() {
  const router = useRouter();
  const { isLoading } = useAuthGuard(false);
  const { leadScore, qualificationData, setCurrentStep } = useLead();

  useEffect(() => {
    if (!isLoading && !leadScore) {
      router.replace('/conversation');
    }
  }, [isLoading, leadScore, router]);

  if (isLoading || !leadScore) return null;

  const handleBookAppointment = () => {
    setCurrentStep('booking');
    router.push('/booking');
  };

  const handleContinueConversation = () => {
    setCurrentStep('conversation');
    router.push('/conversation');
  };

  const handleNurture = () => {
    toast.success('Added to nurture campaign! We\'ll follow up via email.');
  };

  const isHighlyQualified = leadScore.status === 'Highly Qualified';
  const isPartial = leadScore.status === 'Partially Qualified';
  const isNotQualified = leadScore.status === 'Not Qualified';

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8faff 0%, #fdf5ff 100%)' }} className="page-enter">
      <Header showBreadcrumb adminLink />

      {/* Hero bar */}
      <div style={{
        background: 'var(--gradient)',
        padding: '28px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: -40, left: -40, width: 150, height: 150, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
        </div>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
          Qualification Complete
        </p>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'white', margin: 0 }}>
          {qualificationData.name ? `${qualificationData.name}'s Lead Score` : 'Your Lead Score'}
        </h1>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 28, alignItems: 'start' }}>

          {/* Left column: Score + Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <ScoreCard score={leadScore.score} status={leadScore.status} />

            {/* Action buttons */}
            <div style={{ background: 'white', borderRadius: 20, padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
                Recommended Actions
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(isHighlyQualified || isPartial) && (
                  <button
                    id="book-appointment-btn"
                    onClick={handleBookAppointment}
                    style={{
                      width: '100%',
                      padding: '14px 20px',
                      background: 'var(--gradient)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      transition: 'all 0.2s',
                      boxShadow: '0 4px 16px rgba(102,126,234,0.35)',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'}
                  >
                    <Calendar size={16} />
                    {isHighlyQualified ? 'Book Appointment Now' : 'Book Appointment Anyway'}
                    <ArrowRight size={14} style={{ marginLeft: 'auto' }} />
                  </button>
                )}

                <button
                  onClick={handleContinueConversation}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    background: isNotQualified ? 'var(--gradient)' : '#f0f4ff',
                    color: isNotQualified ? 'white' : 'var(--primary)',
                    border: isNotQualified ? 'none' : '1px solid rgba(102,126,234,0.2)',
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'all 0.2s',
                    boxShadow: isNotQualified ? '0 4px 16px rgba(102,126,234,0.3)' : 'none',
                  }}
                >
                  <MessageSquare size={16} />
                  Continue Conversation
                </button>

                {(isNotQualified || isPartial) && (
                  <button
                    onClick={handleNurture}
                    style={{
                      width: '100%',
                      padding: '12px 20px',
                      background: 'transparent',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border)',
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      transition: 'all 0.2s',
                    }}
                  >
                    <Mail size={16} />
                    Add to Nurture Campaign
                  </button>
                )}
              </div>
            </div>

            {/* Score reasons */}
            <ScoreReasons reasons={leadScore.reasons} />
          </div>

          {/* Right column: Summary */}
          <QualificationSummary data={qualificationData} />
        </div>
      </div>
    </div>
  );
}
