'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLead } from '@/contexts/LeadContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import Header from '@/components/layout/Header';
import { API_BASE_URL } from '@/config';
import MessageBubble from '@/components/chat/MessageBubble';
import TypingIndicator from '@/components/chat/TypingIndicator';
import ChatInput from '@/components/chat/ChatInput';
import QualificationProgress from '@/components/chat/QualificationProgress';
import { BarChart3, X, Calendar as CalendarIcon, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ConversationPage() {
  const router = useRouter();
  const { isLoading } = useAuthGuard(false);
  const { messages, addMessage, qualificationData, updateQualificationData, setLeadScore, setCurrentStep, clearMessages, backendLeadId, setSelectedAppointment } = useLead();
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isTyping, availableSlots]);

  const bookSlot = async (slot: any) => {
    setIsTyping(true);
    setAvailableSlots([]); // Hide slots once clicked
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: backendLeadId,
          appointment_date: slot.date,
          appointment_time: slot.time
        })
      });
      const data = await res.json();
      
      addMessage({ role: 'ai', content: `Great! I've booked your appointment for ${slot.time} on ${slot.date}. You will be redirected shortly...` });
      
      setTimeout(() => {
        router.push('/crm-summary');
      }, 2000);
    } catch (e) {
      console.error(e);
      toast.error('Failed to book appointment');
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (!initialized.current && messages.length === 0) {
      initialized.current = true;
      setCurrentStep('conversation');
      clearMessages();
      
      // We start the conversation locally instead of fetching from API initially to save time,
      // or we can just send a hidden "hello" to trigger the backend API.
      // For a better UX, we'll send a local welcome message.
      setTimeout(() => {
        addMessage({ 
          role: 'ai', 
          content: "Hi there! 👋 I'm PropAI, your real estate qualification assistant. What kind of property are you looking for?" 
        });
      }, 500);
    }
  }, []);

  const handleUserMessage = useCallback(async (text: string) => {
    if (isTyping || !backendLeadId) return;

    addMessage({ role: 'user', content: text });
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id: backendLeadId, message: text })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to communicate with AI');
      }
      
      addMessage({ role: 'ai', content: data.reply || "Sorry, I encountered an error. Please try again." });
      if (data.qualification) {
        updateQualificationData({
          buyerType: data.qualification.buyer_type || '',
          purpose: data.qualification.purchase_purpose || '',
          location: data.qualification.location || '',
          propertyType: data.qualification.property_type || '',
          budget: data.qualification.budget || '',
          financing: data.qualification.financing || '',
          timeline: data.qualification.purchase_timeline || '',
        });
      }

      // Update score if available
      if (data.qualification_score !== undefined && data.qualification_score !== null) {
        setLeadScore({ score: data.qualification_score, status: data.qualification_status || 'Qualified', reasons: [] });
      }

      // If available slots returned, show them in UI
      if (data.available_slots && data.available_slots.length > 0) {
        setAvailableSlots(data.available_slots);
      }

    } catch (e) {
      console.error(e);
      toast.error("Network error communicating with AI");
    } finally {
      setIsTyping(false);
    }
  }, [isTyping, backendLeadId, addMessage, updateQualificationData, setLeadScore]);

  if (isLoading || !backendLeadId) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
        {!backendLeadId && !isLoading ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: 12 }}>Please start from the homepage to create a lead.</p>
            <button onClick={() => router.push('/')} style={{ background: 'var(--gradient)', color: 'white', padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>Go Home</button>
          </div>
        ) : (
          <div style={{ width: 40, height: 40, border: '4px solid #f0f0f0', borderTopColor: '#667eea', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        )}
      </div>
    );
  }

  // Calculate progress for UI
  const fields = ['buyerType', 'purpose', 'location', 'propertyType', 'budget', 'financing', 'timeline'];
  const filled = fields.filter(f => !!qualificationData[f as keyof typeof qualificationData]).length;
  const progressPct = (filled / fields.length) * 100;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f8f9fa', overflow: 'hidden' }}>
      <Header showBreadcrumb transparent={false} />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* ============ CHAT AREA ============ */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          {/* Chat header bar */}
          <div style={{
            padding: '12px 20px',
            background: 'white',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                AI Lead Qualification
              </p>
              <div style={{ height: 4, background: '#f0f0f0', borderRadius: 2, marginTop: 6, maxWidth: 300 }}>
                <div style={{
                  height: '100%',
                  width: `${progressPct}%`,
                  background: 'var(--gradient)',
                  borderRadius: 2,
                  transition: 'width 0.4s ease',
                }} />
              </div>
            </div>

            {/* Mobile: sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: '#f0f4ff', border: 'none', borderRadius: 10, padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontSize: 13, fontWeight: 600 }}
            >
              <BarChart3 size={15} />
              <span>Progress</span>
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
            }}
            className="scrollbar-thin"
          >
            {messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            
            {/* Slot Booking UI inline in chat */}
            {availableSlots.length > 0 && !isTyping && (
              <div style={{ margin: '16px 0 16px 48px', display: 'flex', flexDirection: 'column', gap: 10, animation: 'fadeIn 0.3s ease' }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Available Slots:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {availableSlots.map((slot, idx) => (
                    <button
                      key={idx}
                      onClick={() => bookSlot(slot)}
                      style={{
                        background: 'white',
                        border: '1px solid var(--primary)',
                        color: 'var(--primary)',
                        padding: '10px 16px',
                        borderRadius: 12,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        boxShadow: '0 2px 8px rgba(102,126,234,0.1)',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--primary)'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'white'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--primary)'; }}
                    >
                      <CalendarIcon size={16} />
                      {slot.date} at {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isTyping && <TypingIndicator />}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <ChatInput
            onSend={handleUserMessage}
            disabled={isTyping || availableSlots.length > 0}
            placeholder={isTyping ? 'PropAI is typing...' : (availableSlots.length > 0 ? 'Please select a slot above' : 'Type your response...')}
          />
        </div>

        {/* ============ SIDEBAR ============ */}
        <div
          style={{
            width: 320,
            background: 'white',
            borderLeft: '1px solid rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            padding: '16px',
            overflow: 'hidden',
            flexShrink: 0,
          }}
          className="hidden lg:flex"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '0 4px' }}>
            <BarChart3 size={16} color="var(--primary)" />
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Qualification Progress</h3>
          </div>
          <QualificationProgress data={qualificationData} />
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={() => setSidebarOpen(false)}
          >
            <div
              style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 320, background: 'white', padding: 20, display: 'flex', flexDirection: 'column' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BarChart3 size={16} color="var(--primary)" />
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Qualification Progress</h3>
                </div>
                <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                  <X size={20} />
                </button>
              </div>
              <QualificationProgress data={qualificationData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
