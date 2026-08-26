'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLead } from '@/contexts/LeadContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import Header from '@/components/layout/Header';
import TimeSlots, { TimeSlot } from '@/components/booking/TimeSlots';
import { Calendar, CheckCircle, User, Clock, Phone, Mail, ArrowRight, Award } from 'lucide-react';
import toast from 'react-hot-toast';

const availableSlots: TimeSlot[] = [
  { id: 's1', dayLabel: 'Monday, Sep 2', date: 'Mon Sep 2', time: '9:00 AM', available: true, consultant: 'Sarah Al-Rashid', consultantTitle: 'Senior Investment Consultant', consultantRating: 5, tag: 'Popular' },
  { id: 's2', dayLabel: 'Monday, Sep 2', date: 'Mon Sep 2', time: '11:30 AM', available: true, consultant: 'James Mitchell', consultantTitle: 'Luxury Property Specialist', consultantRating: 5 },
  { id: 's3', dayLabel: 'Monday, Sep 2', date: 'Mon Sep 2', time: '2:00 PM', available: false, consultant: 'Priya Sharma', consultantTitle: 'Market Analytics Expert', consultantRating: 4 },
  { id: 's4', dayLabel: 'Tuesday, Sep 3', date: 'Tue Sep 3', time: '10:00 AM', available: true, consultant: 'Ahmed Al-Mansoori', consultantTitle: 'Dubai Market Specialist', consultantRating: 5, tag: 'Top Rated' },
  { id: 's5', dayLabel: 'Tuesday, Sep 3', date: 'Tue Sep 3', time: '1:30 PM', available: true, consultant: 'Sarah Al-Rashid', consultantTitle: 'Senior Investment Consultant', consultantRating: 5 },
  { id: 's6', dayLabel: 'Tuesday, Sep 3', date: 'Tue Sep 3', time: '5:30 PM', available: true, consultant: 'Marcus Chen', consultantTitle: 'International Investments', consultantRating: 4, tag: 'Evening' },
  { id: 's7', dayLabel: 'Wednesday, Sep 4', date: 'Wed Sep 4', time: '9:30 AM', available: true, consultant: 'James Mitchell', consultantTitle: 'Luxury Property Specialist', consultantRating: 5 },
  { id: 's8', dayLabel: 'Wednesday, Sep 4', date: 'Wed Sep 4', time: '3:00 PM', available: false, consultant: 'Ahmed Al-Mansoori', consultantTitle: 'Dubai Market Specialist', consultantRating: 5 },
  { id: 's9', dayLabel: 'Thursday, Sep 5', date: 'Thu Sep 5', time: '11:00 AM', available: true, consultant: 'Priya Sharma', consultantTitle: 'Market Analytics Expert', consultantRating: 4 },
];

export default function BookingPage() {
  const router = useRouter();
  const { isLoading } = useAuthGuard(false);
  const { qualificationData, setSelectedAppointment, setCurrentStep, finalizeCRM } = useLead();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [email, setEmail] = useState(qualificationData.email || '');
  const [phone, setPhone] = useState(qualificationData.phone || '');
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
        <div style={{ width: 40, height: 40, border: '4px solid #f0f0f0', borderTopColor: '#667eea', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  const selectedSlot = availableSlots.find(s => s.id === selectedId);

  const handleSelect = (slot: TimeSlot) => {
    setSelectedId(slot.id);
  };

  const handleConfirm = async () => {
    if (!selectedSlot) {
      toast.error('Please select a time slot first');
      return;
    }
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setConfirming(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    setSelectedAppointment({
      date: selectedSlot.date,
      time: selectedSlot.time,
      consultant: selectedSlot.consultant,
      consultantTitle: selectedSlot.consultantTitle,
      dayLabel: selectedSlot.dayLabel,
    });
    finalizeCRM();
    setCurrentStep('crm');
    setConfirming(false);
    setConfirmed(true);

    toast.success('Appointment confirmed! 🎉');
    setTimeout(() => router.push('/crm-summary'), 1000);
  };

  if (confirmed) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8faff, #fdf5ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', animation: 'scaleIn 0.4s ease' }}>
          <div style={{ width: 80, height: 80, background: 'var(--gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 10px 30px rgba(102,126,234,0.4)' }}>
            <CheckCircle size={40} color="white" />
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' }}>Appointment Confirmed!</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>Redirecting to your summary...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8faff 0%, #fdf5ff 100%)' }} className="page-enter">
      <Header showBreadcrumb adminLink />

      {/* Hero */}
      <div style={{ background: 'var(--gradient)', padding: '28px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
        </div>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Step 3 of 4</p>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'white', margin: 0 }}>Book Your Consultation</h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 8 }}>Choose a time that works for you with one of our expert consultants</p>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 28, alignItems: 'start' }}>

          {/* Left: Slots */}
          <div>
            <div style={{ background: 'white', borderRadius: 20, padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid var(--border)', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <div style={{ width: 40, height: 40, background: '#f0f4ff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={20} color="var(--primary)" />
                </div>
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Available Time Slots</h2>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>All times shown in GST (Gulf Standard Time)</p>
                </div>
              </div>

              <TimeSlots slots={availableSlots} selected={selectedId} onSelect={handleSelect} />
            </div>

            {/* Contact confirmation */}
            <div style={{ background: 'white', borderRadius: 20, padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Confirmation Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                    <Mail size={12} style={{ display: 'inline', marginRight: 4 }} />
                    Email Address *
                  </label>
                  <input
                    id="booking-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1.5px solid var(--border)',
                      borderRadius: 10,
                      fontSize: 14,
                      outline: 'none',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.2s',
                      background: 'white',
                      color: 'var(--text-primary)',
                    }}
                    onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'var(--primary)'}
                    onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'var(--border)'}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                    <Phone size={12} style={{ display: 'inline', marginRight: 4 }} />
                    Phone Number
                  </label>
                  <input
                    id="booking-phone"
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+971 XX XXX XXXX"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1.5px solid var(--border)',
                      borderRadius: 10,
                      fontSize: 14,
                      outline: 'none',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.2s',
                      background: 'white',
                      color: 'var(--text-primary)',
                    }}
                    onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'var(--primary)'}
                    onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'var(--border)'}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Summary + confirm */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 84 }}>
            {/* Selected slot preview */}
            <div style={{ background: 'white', borderRadius: 20, padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Selected Appointment</h3>

              {selectedSlot ? (
                <div style={{ animation: 'fadeInUp 0.25s ease' }}>
                  {/* Day & time */}
                  <div style={{ background: 'var(--gradient)', borderRadius: 14, padding: '16px', marginBottom: 16, textAlign: 'center' }}>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>{selectedSlot.dayLabel}</p>
                    <p style={{ fontSize: 28, fontWeight: 900, color: 'white', letterSpacing: '-0.03em' }}>{selectedSlot.time}</p>
                  </div>

                  {/* Consultant */}
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px', background: '#f8f9fa', borderRadius: 12, marginBottom: 12 }}>
                    <div style={{ width: 44, height: 44, background: 'var(--gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                      {selectedSlot.consultant.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{selectedSlot.consultant}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selectedSlot.consultantTitle}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                        <Award size={12} color="#f59e0b" />
                        <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 600 }}>{selectedSlot.consultantRating}.0 Rating</span>
                      </div>
                    </div>
                  </div>

                  {/* Duration */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)', padding: '8px 0' }}>
                    <Clock size={14} />
                    <span>60-minute consultation</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)', padding: '8px 0' }}>
                    <CheckCircle size={14} color="#10b981" />
                    <span>Confirmation sent to your email</span>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)' }}>
                  <Calendar size={32} style={{ opacity: 0.3, margin: '0 auto 10px' }} />
                  <p style={{ fontSize: 13 }}>Select a time slot to preview your appointment</p>
                </div>
              )}
            </div>

            {/* Confirm button */}
            <button
              id="confirm-appointment-btn"
              onClick={handleConfirm}
              disabled={!selectedSlot || confirming}
              style={{
                width: '100%',
                padding: '16px 24px',
                background: selectedSlot ? 'var(--gradient)' : '#e5e7eb',
                color: selectedSlot ? 'white' : '#9ca3af',
                border: 'none',
                borderRadius: 16,
                fontSize: 16,
                fontWeight: 800,
                cursor: selectedSlot ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                transition: 'all 0.2s',
                boxShadow: selectedSlot ? '0 8px 24px rgba(102,126,234,0.4)' : 'none',
              }}
              onMouseEnter={e => { if (selectedSlot) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'}
            >
              {confirming ? (
                <>
                  <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Confirming...
                </>
              ) : (
                <>
                  <Calendar size={18} />
                  Confirm Appointment
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Lead info recap */}
            {qualificationData.name && (
              <div style={{ background: 'white', borderRadius: 16, padding: '16px', border: '1px solid var(--border)', fontSize: 13 }}>
                <p style={{ fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Lead Summary</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { icon: <User size={12} />, label: qualificationData.name },
                    { icon: <Mail size={12} />, label: qualificationData.email || 'Not provided' },
                    { icon: <Clock size={12} />, label: `Timeline: ${qualificationData.timeline || 'TBD'}` },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--primary)', flexShrink: 0 }}>{item.icon}</span>
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
