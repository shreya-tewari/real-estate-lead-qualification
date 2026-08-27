'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2, ChevronRight, MessageSquare, BarChart3, Calendar,
  FileText, LayoutDashboard, LogOut, User, Shield
} from 'lucide-react';
import { useLead } from '@/contexts/LeadContext';
import { useAuth } from '@/contexts/AuthContext';
import { AppStep } from '@/types/Lead';

const steps: { key: AppStep; label: string; icon: React.ReactNode; shortLabel: string }[] = [
  { key: 'conversation', label: 'Conversation', shortLabel: 'Chat', icon: <MessageSquare size={14} /> },
  { key: 'scoring', label: 'Lead Scoring', shortLabel: 'Score', icon: <BarChart3 size={14} /> },
  { key: 'booking', label: 'Book Appointment', shortLabel: 'Book', icon: <Calendar size={14} /> },
  { key: 'crm', label: 'CRM Summary', shortLabel: 'CRM', icon: <FileText size={14} /> },
];

const stepOrder: AppStep[] = ['home', 'conversation', 'scoring', 'booking', 'crm'];

interface HeaderProps {
  showBreadcrumb?: boolean;
  transparent?: boolean;
  adminLink?: boolean;
}

export default function Header({ showBreadcrumb = false, transparent = false, adminLink = false }: HeaderProps) {
  const router = useRouter();
  const { currentStep } = useLead();
  const { auth, isAuthenticated, isAdmin, logout } = useAuth();
  const currentIndex = stepOrder.indexOf(currentStep);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const initials = isAdmin
    ? 'A'
    : auth.name
      ? auth.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
      : 'U';

  const displayName = isAdmin ? (auth.username || 'Admin') : (auth.name || 'User');

  return (
    <header
      style={{
        background: transparent ? 'transparent' : 'rgba(255,255,255,0.95)',
        backdropFilter: transparent ? 'none' : 'blur(16px)',
        borderBottom: transparent ? 'none' : '1px solid rgba(102,126,234,0.1)',
        padding: '0 24px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: transparent ? 'none' : '0 1px 20px rgba(0,0,0,0.05)',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => router.push('/')}>
        <div
          style={{
            width: 36,
            height: 36,
            background: 'var(--gradient)',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Building2 size={20} color="white" />
        </div>
        <div>
          <span style={{ fontWeight: 800, fontSize: 18, color: transparent ? 'white' : 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            PropAI
          </span>
          <span style={{ fontWeight: 400, fontSize: 11, color: transparent ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)', display: 'block', lineHeight: 1, marginTop: -1 }}>
            Smart Lead Qualification
          </span>
        </div>
      </div>

      {/* Breadcrumb for User flow */}
      {showBreadcrumb && !isAdmin && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {steps.map((step, idx) => {
            const stepIdx = stepOrder.indexOf(step.key);
            const isCompleted = currentIndex > stepIdx;
            const isActive = currentStep === step.key;
            return (
              <React.Fragment key={step.key}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '5px 10px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    background: isActive ? 'var(--gradient)' : isCompleted ? '#f0f4ff' : 'transparent',
                    color: isActive ? 'white' : isCompleted ? 'var(--primary)' : 'var(--text-muted)',
                    transition: 'all 0.2s',
                  }}
                >
                  {step.icon}
                  <span className="hidden md:inline">{step.label}</span>
                  <span className="md:hidden">{step.shortLabel}</span>
                </div>
                {idx < steps.length - 1 && (
                  <ChevronRight size={14} color={isCompleted ? 'var(--primary)' : '#d1d5db'} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Admin Mode Badge if logged in as Admin */}
      {isAdmin && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#faf5ff', borderRadius: 20, padding: '5px 14px', border: '1px solid rgba(118,75,162,0.2)' }}>
          <Shield size={13} color="#764ba2" />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#764ba2' }}>Admin Portal</span>
        </div>
      )}

      {/* Right side actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {adminLink && !isAdmin && (
          <button
            onClick={() => router.push(isAdmin ? '/admin' : '/login?tab=admin')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              color: transparent ? 'rgba(255,255,255,0.85)' : 'var(--text-secondary)',
              background: 'transparent',
              border: `1px solid ${transparent ? 'rgba(255,255,255,0.3)' : 'var(--border)'}`,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <LayoutDashboard size={14} />
            Admin Portal
          </button>
        )}

        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: transparent ? 'rgba(255,255,255,0.15)' : '#f8f9fa',
                borderRadius: 20,
                padding: '4px 12px 4px 4px',
                border: `1px solid ${transparent ? 'rgba(255,255,255,0.25)' : 'var(--border)'}`,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: isAdmin ? 'linear-gradient(135deg, #764ba2, #667eea)' : 'var(--gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 800,
                  color: 'white',
                }}
              >
                {initials}
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: transparent ? 'white' : 'var(--text-primary)' }}>
                {displayName}
              </span>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: transparent ? 'rgba(255,255,255,0.15)' : '#f0f0f0',
                border: `1px solid ${transparent ? 'rgba(255,255,255,0.3)' : 'var(--border)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: transparent ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => router.push('/login')}
            style={{
              padding: '7px 18px',
              background: transparent ? 'rgba(255,255,255,0.2)' : 'var(--gradient)',
              color: 'white',
              border: 'none',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
