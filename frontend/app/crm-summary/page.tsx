'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLead } from '@/contexts/LeadContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import Header from '@/components/layout/Header';
import SalesSummary from '@/components/crm/SalesSummary';
import { API_BASE_URL } from '@/config';
import Badge from '@/components/common/Badge';
import {
  User, Mail, Phone, Calendar as CalIcon, DollarSign, MapPin, Home,
  Clock, CreditCard, Target, Download, Share2, MessageSquare, RefreshCw,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface InfoCardProps {
  title: string;
  subtitle?: string;
  rows: { label: string; value: string; icon?: React.ReactNode }[];
  headerColor?: string;
}

function InfoCard({ title, subtitle, rows, headerColor = 'var(--gradient)' }: InfoCardProps) {
  return (
    <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid var(--border)' }}>
      <div style={{ background: headerColor, padding: '16px 20px' }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'white', margin: 0 }}>{title}</h3>
        {subtitle && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>{subtitle}</p>}
      </div>
      <div>
        {rows.map((row, i) => (
          <div
            key={i}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: i < rows.length - 1 ? '1px solid #f5f5f5' : 'none' }}
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#fafbff'}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
          >
            {row.icon && (
              <div style={{ width: 28, height: 28, background: '#f0f4ff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                {row.icon}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{row.label}</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: row.value ? 'var(--text-primary)' : 'var(--text-muted)' }}>{row.value || '—'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CRMSummaryPage() {
  const router = useRouter();
  const { isLoading } = useAuthGuard(false);
  const { resetAll, setCurrentStep, backendLeadId } = useLead();
  const [leadData, setLeadData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!backendLeadId) {
      router.replace('/');
      return;
    }

    fetch(`${API_BASE_URL}/api/leads/${backendLeadId}`)
      .then(res => res.json())
      .then(data => {
        setLeadData(data);
        setLoadingData(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingData(false);
      });
  }, [backendLeadId, router]);

  if (isLoading || loadingData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
        <div style={{ width: 40, height: 40, border: '4px solid #f0f0f0', borderTopColor: '#667eea', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (!leadData) return null;

  const lead = {
    name: leadData.name,
    email: leadData.email || 'N/A',
    phone: leadData.phone || 'N/A',
    buyerType: leadData.buyer_type || 'N/A',
    budget: leadData.budget ? `$${leadData.budget.toLocaleString()}` : 'N/A',
    location: leadData.location || 'N/A',
    propertyType: leadData.property_type || 'N/A',
    timeline: leadData.purchase_timeline || 'N/A',
    financing: leadData.financing || 'N/A',
    purpose: leadData.purchase_purpose || 'N/A',
  };

  const score = {
    score: leadData.qualification_score || 0,
    status: leadData.qualification_status || 'Unqualified'
  };

  const assignedTeam = leadData.assigned_agent || 'General Sales Team';
  const appointment = leadData.appointment_time ? {
    dayLabel: leadData.appointment_date,
    time: leadData.appointment_time,
    consultant: assignedTeam
  } : null;

  const salesBrief = leadData.ai_summary || 'No AI summary generated.';

  const handleDownload = () => {
    const content = `
PropAI Lead Summary
===================
Generated: ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}

LEAD INFORMATION
Name:     ${lead.name}
Email:    ${lead.email}
Phone:    ${lead.phone}

QUALIFICATION DETAILS
Buyer Type:   ${lead.buyerType}
Budget:       ${lead.budget}
Location:     ${lead.location}
Property:     ${lead.propertyType}
Timeline:     ${lead.timeline}
Financing:    ${lead.financing}
Purpose:      ${lead.purpose}

SCORING & ROUTING
Score:        ${score.score}/100
Status:       ${score.status}
Team:         ${assignedTeam}
${appointment ? `Appointment: ${appointment.dayLabel} at ${appointment.time} with ${appointment.consultant}` : ''}

SALES BRIEF
${salesBrief}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PropAI_Lead_${lead.name.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Summary downloaded!');
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Could not copy link');
    }
  };

  const handleNewLead = () => {
    resetAll();
    router.push('/');
  };

  const handleViewConversation = () => {
    setCurrentStep('conversation');
    router.push('/conversation');
  };



  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8faff 0%, #fdf5ff 100%)' }} className="page-enter">
      <Header showBreadcrumb />

      {/* Success banner */}
      <div style={{ background: 'var(--gradient)', padding: '28px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.2)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={28} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'white', margin: 0 }}>Lead Qualification Complete!</h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 3 }}>
              Thank you, {lead.name}! Our team will be in touch with you shortly.
            </p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 32, flexWrap: 'wrap' }}>
          {[
            { id: 'download-summary-btn', icon: <Download size={15} />, label: 'Download Summary', action: handleDownload, primary: true },
            { id: 'share-btn', icon: <Share2 size={15} />, label: 'Share with Team', action: handleShare, primary: false },
            { id: 'view-chat-btn', icon: <MessageSquare size={15} />, label: 'View Conversation', action: handleViewConversation, primary: false },
            { id: 'new-lead-btn', icon: <RefreshCw size={15} />, label: 'Start New Lead', action: handleNewLead, primary: false },
          ].map(btn => (
            <button
              key={btn.id}
              id={btn.id}
              onClick={btn.action}
              style={{
                padding: '10px 20px',
                background: btn.primary ? 'var(--gradient)' : 'white',
                color: btn.primary ? 'white' : 'var(--text-secondary)',
                border: btn.primary ? 'none' : '1px solid var(--border)',
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                transition: 'all 0.2s',
                boxShadow: btn.primary ? '0 4px 16px rgba(102,126,234,0.3)' : '0 1px 4px rgba(0,0,0,0.05)',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'}
            >
              {btn.icon}
              {btn.label}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 28 }}>
          <InfoCard
            title="Lead Profile"
            subtitle="Contact Information"
            rows={[
              { label: 'Full Name', value: lead.name, icon: <User size={13} /> },
              { label: 'Email Address', value: lead.email, icon: <Mail size={13} /> },
              { label: 'Phone Number', value: lead.phone, icon: <Phone size={13} /> },
              { label: 'Lead Created', value: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }), icon: <CalIcon size={13} /> },
            ]}
          />

          <InfoCard
            title="Qualification Details"
            subtitle="Collected from AI conversation"
            headerColor="linear-gradient(135deg, #764ba2, #667eea)"
            rows={[
              { label: 'Buyer Type', value: lead.buyerType, icon: <Target size={13} /> },
              { label: 'Budget', value: lead.budget, icon: <DollarSign size={13} /> },
              { label: 'Location', value: lead.location, icon: <MapPin size={13} /> },
              { label: 'Property Type', value: lead.propertyType, icon: <Home size={13} /> },
              { label: 'Timeline', value: lead.timeline, icon: <Clock size={13} /> },
              { label: 'Financing', value: lead.financing, icon: <CreditCard size={13} /> },
            ]}
          />
        </div>

        {/* AI Sales Brief */}
        <div style={{ background: 'white', borderRadius: 20, padding: 24, border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>AI Generated Sales Brief</h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{salesBrief}</p>
        </div>
      </div>
    </div>
  );
}
