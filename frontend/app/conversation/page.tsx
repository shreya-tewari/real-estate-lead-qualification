'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLead } from '@/contexts/LeadContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import Header from '@/components/layout/Header';
import MessageBubble from '@/components/chat/MessageBubble';
import TypingIndicator from '@/components/chat/TypingIndicator';
import ChatInput from '@/components/chat/ChatInput';
import QualificationProgress from '@/components/chat/QualificationProgress';
import { LeadScore, QualificationData } from '@/types/Lead';
import { ChevronRight, BarChart3, X, Menu } from 'lucide-react';
import toast from 'react-hot-toast';

interface QualificationStep {
  id: keyof QualificationData;
  question: string;
  followUp?: string;
  parse: (input: string) => string | null;
}

const qualificationSteps: QualificationStep[] = [
  {
    id: 'name',
    question: "Hi there! 👋 I'm PropAI, your real estate qualification assistant. I'm here to help match you with the perfect property. To get started, could you share your full name?",
    parse: (input) => input.trim().length > 1 ? input.trim() : null,
  },
  {
    id: 'email',
    question: "Great to meet you, {name}! 😊 Could you share your email address? I'll use it to send you property recommendations and appointment confirmations.",
    parse: (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.trim()) ? input.trim() : null,
  },
  {
    id: 'phone',
    question: "Perfect! And what's the best phone number to reach you on? This helps our consultants follow up with you directly.",
    parse: (input) => input.replace(/\D/g, '').length >= 7 ? input.trim() : null,
  },
  {
    id: 'buyerType',
    question: "Thanks! Now, are you looking to purchase property for **personal use**, as an **investment**, or **both**? This helps me tailor my recommendations.",
    parse: (input) => {
      const lower = input.toLowerCase();
      if (lower.includes('personal') && lower.includes('invest')) return 'Personal & Investment';
      if (lower.includes('invest')) return 'Investment';
      if (lower.includes('personal') || lower.includes('own') || lower.includes('live')) return 'Personal Use';
      if (lower.includes('both')) return 'Personal & Investment';
      return input.trim().length > 2 ? input.trim() : null;
    },
  },
  {
    id: 'budget',
    question: "Excellent! What's your budget range for this property purchase? For example: '$300K–$500K', 'AED 1M–2M', or just an approximate figure works too.",
    parse: (input) => {
      const hasCurrency = /[$£€]|aed|usd|million|m\b|k\b|\d/.test(input.toLowerCase());
      return hasCurrency || input.trim().length > 4 ? input.trim() : null;
    },
  },
  {
    id: 'location',
    question: "Great choice! Which location or area are you most interested in? Are you focused on a specific city or open to multiple markets?",
    parse: (input) => input.trim().length > 2 ? input.trim() : null,
  },
  {
    id: 'propertyType',
    question: "Understood! What type of property are you looking for? For example: apartment, villa, townhouse, commercial, or something else?",
    parse: (input) => input.trim().length > 2 ? input.trim() : null,
  },
  {
    id: 'timeline',
    question: "Perfect! When are you looking to make this purchase? Are you ready to buy immediately, or are you planning for 3–6 months, 6–12 months, or longer?",
    parse: (input) => input.trim().length > 2 ? input.trim() : null,
  },
  {
    id: 'financing',
    question: "Almost done! How are you planning to finance this purchase? Options include cash, mortgage, developer payment plan, or a mix. What works best for you?",
    parse: (input) => input.trim().length > 2 ? input.trim() : null,
  },
  {
    id: 'purpose',
    question: "Last question — what's your primary goal with this property? For example: rental income, capital appreciation, personal lifestyle, or a combination?",
    parse: (input) => input.trim().length > 2 ? input.trim() : null,
  },
];

function calculateScore(data: QualificationData): LeadScore {
  const reasons = [];
  let score = 0;

  if (data.name) { score += 5; reasons.push({ label: 'Contact information provided', points: 5, achieved: true }); }
  else { reasons.push({ label: 'Contact information provided', points: 5, achieved: false }); }

  if (data.email) { score += 10; reasons.push({ label: 'Email address verified', points: 10, achieved: true }); }
  else { reasons.push({ label: 'Email address verified', points: 10, achieved: false }); }

  const isInvestor = data.buyerType.toLowerCase().includes('invest');
  if (isInvestor) { score += 20; reasons.push({ label: 'Investment buyer (high value)', points: 20, achieved: true }); }
  else if (data.buyerType) { score += 12; reasons.push({ label: 'Personal buyer intent confirmed', points: 12, achieved: true }); }
  else { reasons.push({ label: 'Buyer intent confirmed', points: 15, achieved: false }); }

  if (data.budget) { score += 20; reasons.push({ label: 'Budget clearly defined', points: 20, achieved: true }); }
  else { reasons.push({ label: 'Budget clearly defined', points: 20, achieved: false }); }

  if (data.location) { score += 15; reasons.push({ label: 'Target location identified', points: 15, achieved: true }); }
  else { reasons.push({ label: 'Target location identified', points: 15, achieved: false }); }

  if (data.propertyType) { score += 10; reasons.push({ label: 'Property type specified', points: 10, achieved: true }); }
  else { reasons.push({ label: 'Property type specified', points: 10, achieved: false }); }

  const urgentTimeline = data.timeline && /immediate|now|asap|1.3|3.6|soon|months|ready/i.test(data.timeline);
  if (urgentTimeline) { score += 15; reasons.push({ label: 'Urgent purchase timeline (high priority)', points: 15, achieved: true }); }
  else if (data.timeline) { score += 8; reasons.push({ label: 'Timeline provided', points: 8, achieved: true }); }
  else { reasons.push({ label: 'Clear purchase timeline', points: 10, achieved: false }); }

  if (data.financing) { score += 5; reasons.push({ label: 'Financing method identified', points: 5, achieved: true }); }
  else { reasons.push({ label: 'Financing method identified', points: 5, achieved: false }); }

  const finalScore = Math.min(score, 100);
  const status = finalScore >= 80 ? 'Highly Qualified' : finalScore >= 60 ? 'Partially Qualified' : 'Not Qualified';

  return { score: finalScore, status, reasons };
}

export default function ConversationPage() {
  const router = useRouter();
  const { isLoading } = useAuthGuard(false);
  const { messages, addMessage, qualificationData, updateQualificationData, setLeadScore, setCurrentStep, clearMessages } = useLead();
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setStep] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  const sendAIMessage = useCallback((text: string) => {
    setIsTyping(true);
    const delay = 800 + Math.random() * 700;
    setTimeout(() => {
      setIsTyping(false);
      addMessage({ role: 'ai', content: text });
    }, delay);
  }, [addMessage]);

  useEffect(() => {
    if (!initialized.current && messages.length === 0) {
      initialized.current = true;
      setCurrentStep('conversation');
      clearMessages();
      setTimeout(() => {
        sendAIMessage(qualificationSteps[0].question);
      }, 500);
    }
  }, []);

  const handleUserMessage = useCallback(async (text: string) => {
    if (isTyping) return;

    addMessage({ role: 'user', content: text });

    const step = qualificationSteps[currentStep];
    if (!step) return;

    const parsed = step.parse(text);
    const stepIndex = currentStep;

    if (parsed) {
      updateQualificationData({ [step.id]: parsed });
      const nextIndex = stepIndex + 1;
      setStep(nextIndex);

      if (nextIndex >= qualificationSteps.length) {
        // All done — wrap up
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addMessage({
            role: 'ai',
            content: `Excellent! I've collected all the information I need. Let me calculate your qualification score now... 🎯\n\nThank you for sharing all those details! I'm analyzing your profile to find the best matches and determine your lead score.`,
          });

          setTimeout(() => {
            const updatedData = {
              ...qualificationData,
              [step.id]: parsed,
            };
            const score = calculateScore(updatedData);
            setLeadScore(score);
            setCurrentStep('scoring');

            setTimeout(() => {
              addMessage({
                role: 'ai',
                content: `Your qualification score is ready! Based on our conversation, you scored **${score.score}/100** — categorized as "${score.status}". 🌟\n\nRedirecting you to your results now...`,
              });
              setTimeout(() => router.push('/scoring'), 2000);
            }, 1500);
          }, 2000);
        }, 1200);
      } else {
        // Next question
        let nextQ = qualificationSteps[nextIndex].question;
        nextQ = nextQ.replace('{name}', qualificationData.name || parsed);
        sendAIMessage(nextQ);
      }
    } else {
      // Couldn't parse — ask again
      const retryMessages: Record<string, string> = {
        email: `Hmm, that doesn't look like a valid email address. Could you double-check and re-enter it? For example: john@example.com`,
        phone: `I need a phone number with at least 7 digits. Could you share your number again?`,
      };
      const retry = retryMessages[step.id] || `I want to make sure I captured that correctly. Could you elaborate a bit more on "${step.id.replace(/([A-Z])/g, ' $1').toLowerCase()}"?`;
    }
  }, [isTyping, currentStep, addMessage, updateQualificationData, qualificationData, sendAIMessage, setLeadScore, setCurrentStep, router]);

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
        <div style={{ width: 40, height: 40, border: '4px solid #f0f0f0', borderTopColor: '#667eea', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

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
                <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 10 }}>
                  Question {Math.min(currentStep + 1, qualificationSteps.length)}/{qualificationSteps.length}
                </span>
              </p>
              <div style={{ height: 4, background: '#f0f0f0', borderRadius: 2, marginTop: 6, maxWidth: 300 }}>
                <div style={{
                  height: '100%',
                  width: `${(currentStep / qualificationSteps.length) * 100}%`,
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
            {isTyping && <TypingIndicator />}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <ChatInput
            onSend={handleUserMessage}
            disabled={isTyping || currentStep >= qualificationSteps.length}
            placeholder={isTyping ? 'PropAI is typing...' : 'Type your response...'}
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
