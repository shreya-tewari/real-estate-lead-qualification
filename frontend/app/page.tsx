'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLead } from '@/contexts/LeadContext';
import Header from '@/components/layout/Header';
import {
  MessageSquare, BarChart3, Calendar, CheckCircle, ArrowRight,
  Zap, Shield, Globe, TrendingUp, Users, Star, Building2,
  ChevronDown
} from 'lucide-react';

const stats = [
  { value: '94%', label: 'Qualification Accuracy', icon: <CheckCircle size={20} />, color: '#10b981' },
  { value: '<2min', label: 'Avg. Qualification Time', icon: <Zap size={20} />, color: '#667eea' },
  { value: '3.2×', label: 'Conversion Rate Lift', icon: <TrendingUp size={20} />, color: '#f59e0b' },
  { value: '10K+', label: 'Leads Qualified', icon: <Users size={20} />, color: '#764ba2' },
];

const features = [
  {
    icon: <MessageSquare size={24} />,
    title: 'Natural AI Conversations',
    description: 'Our AI agent guides prospects through qualification naturally, adapting questions based on responses.',
    color: '#667eea',
  },
  {
    icon: <BarChart3 size={24} />,
    title: 'Intelligent Lead Scoring',
    description: 'Every lead is scored instantly based on 10+ qualification criteria with transparent reasoning.',
    color: '#764ba2',
  },
  {
    icon: <Calendar size={24} />,
    title: 'Instant Appointment Booking',
    description: 'Qualified leads can book directly with the right consultant, eliminating manual scheduling.',
    color: '#10b981',
  },
  {
    icon: <Shield size={24} />,
    title: 'CRM-Ready Handover',
    description: 'Complete lead profiles with AI-generated sales briefs handed off seamlessly to your sales team.',
    color: '#f59e0b',
  },
  {
    icon: <Globe size={24} />,
    title: 'Multi-Market Support',
    description: 'Built for global real estate markets including Dubai, UAE, and international property investments.',
    color: '#ef4444',
  },
  {
    icon: <TrendingUp size={24} />,
    title: 'Real-Time Analytics',
    description: 'Monitor lead quality, conversion rates, and team performance through a powerful admin dashboard.',
    color: '#8b5cf6',
  },
];

const testimonials = [
  { name: 'Sarah Al-Mansoori', title: 'Sales Director, Emirates Properties', text: 'PropAI cut our qualification time from 2 hours to under 5 minutes. The lead quality has never been better.', rating: 5 },
  { name: 'James Mitchell', title: 'Investment Consultant, Dubai Realty', text: 'The AI conversations feel remarkably natural. Our clients don\'t even realize they\'re being qualified — they just feel heard.', rating: 5 },
  { name: 'Priya Sharma', title: 'Head of Leads, Gulf Properties', text: 'We\'ve seen a 3.2x improvement in our conversion rates since deploying PropAI. It\'s transformed how we handle inbound leads.', rating: 5 },
];

export default function HomePage() {
  const router = useRouter();
  const { setCurrentStep, resetAll } = useLead();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStart = () => {
    resetAll();
    setCurrentStep('conversation');
    router.push('/conversation');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'white', overflow: 'hidden' }}>
      {/* Sticky header */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, transition: 'all 0.3s', background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent', backdropFilter: scrolled ? 'blur(16px)' : 'none', borderBottom: scrolled ? '1px solid rgba(102,126,234,0.1)' : 'none', boxShadow: scrolled ? '0 1px 20px rgba(0,0,0,0.05)' : 'none' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: 'var(--gradient)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={20} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 18, color: scrolled ? 'var(--text-primary)' : 'white', letterSpacing: '-0.03em' }}>PropAI</span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <a href="/admin" style={{ fontSize: 13, fontWeight: 600, color: scrolled ? 'var(--text-secondary)' : 'rgba(255,255,255,0.85)', textDecoration: 'none', padding: '6px 14px', borderRadius: 20, border: `1px solid ${scrolled ? 'var(--border)' : 'rgba(255,255,255,0.3)'}`, transition: 'all 0.2s' }}>
              Admin
            </a>
            <button
              onClick={handleStart}
              style={{ background: scrolled ? 'var(--gradient)' : 'white', color: scrolled ? 'white' : 'var(--primary)', border: 'none', borderRadius: 20, padding: '8px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* ============ HERO SECTION ============ */}
      <section
        style={{
          background: 'var(--gradient)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative background orbs */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: -100, right: -100, width: 600, height: 600, background: 'rgba(255,255,255,0.06)', borderRadius: '50%', animation: 'float 8s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', bottom: -200, left: -100, width: 500, height: 500, background: 'rgba(255,255,255,0.04)', borderRadius: '50%', animation: 'float 10s ease-in-out infinite reverse' }} />
          <div style={{ position: 'absolute', top: '40%', left: '30%', width: 300, height: 300, background: 'rgba(255,255,255,0.03)', borderRadius: '50%', animation: 'float 12s ease-in-out infinite 2s' }} />
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 24px 80px', width: '100%', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            {/* Left: Text */}
            <div>
              <div
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '6px 14px',
                  fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.9)',
                  marginBottom: 24, border: '1px solid rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(8px)',
                }}
                className="animate-fadeInDown"
              >
                <Zap size={12} color="#fde047" />
                AI-Powered Lead Qualification
              </div>

              <h1
                style={{ fontSize: 52, fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 20, letterSpacing: '-0.03em' }}
                className="animate-fadeInUp"
              >
                Qualify Real Estate Leads{' '}
                <span style={{ position: 'relative', display: 'inline-block' }}>
                  <span style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '2px 12px' }}>Instantly</span>
                </span>
                {' '}with AI
              </h1>

              <p
                style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: 36, fontWeight: 400 }}
                className="animate-fadeInUp"
              >
                Stop wasting time on unqualified leads. Our AI agent conducts natural conversations,
                scores prospects, and books appointments — all without human involvement.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }} className="animate-fadeInUp">
                <button
                  id="hero-start-btn"
                  onClick={handleStart}
                  style={{
                    background: 'white', color: 'var(--primary)',
                    border: 'none', borderRadius: 40, padding: '16px 36px',
                    fontSize: 16, fontWeight: 800, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 10,
                    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.25)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)';
                  }}
                >
                  <MessageSquare size={18} />
                  Start Conversation
                  <ArrowRight size={16} />
                </button>
                <button
                  style={{
                    background: 'rgba(255,255,255,0.1)', color: 'white',
                    border: '2px solid rgba(255,255,255,0.4)', borderRadius: 40, padding: '16px 28px',
                    fontSize: 15, fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 8,
                    backdropFilter: 'blur(8px)', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)'}
                >
                  Watch Demo
                </button>
              </div>

              {/* Trust indicators */}
              <div style={{ display: 'flex', gap: 20, marginTop: 40, flexWrap: 'wrap' }}>
                {['No credit card', 'Free to try', 'GDPR compliant'].map(label => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>
                    <CheckCircle size={14} color="#86efac" />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Floating chat preview */}
            <div style={{ position: 'relative' }} className="animate-fadeIn">
              <div
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 24,
                  border: '1px solid rgba(255,255,255,0.2)',
                  padding: 24,
                  boxShadow: '0 40px 80px rgba(0,0,0,0.25)',
                  animation: 'float 6s ease-in-out infinite',
                }}
              >
                {/* Chat preview header */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center' }}>
                  <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 size={16} color="white" />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>PropAI Assistant</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 6, height: 6, background: '#86efac', borderRadius: '50%' }} />
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Online · AI Powered</p>
                    </div>
                  </div>
                </div>

                {/* Mock messages */}
                {[
                  { role: 'ai', text: 'Hi! I\'m PropAI. I\'ll help find your perfect property. Are you looking to invest or buy for personal use?', delay: '0s' },
                  { role: 'user', text: 'I\'m looking to invest. Interested in Dubai.', delay: '0.2s' },
                  { role: 'ai', text: 'Great choice! Dubai\'s market is thriving. What\'s your budget range for this investment?', delay: '0.4s' },
                  { role: 'user', text: 'Around $500,000 - $700,000', delay: '0.6s' },
                ].map((msg, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10, animation: `fadeInUp 0.4s ease ${msg.delay} both` }}>
                    <div style={{
                      maxWidth: '80%',
                      padding: '10px 14px',
                      borderRadius: msg.role === 'ai' ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                      background: msg.role === 'ai' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.9)',
                      color: msg.role === 'ai' ? 'white' : 'var(--primary)',
                      fontSize: 13,
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      fontWeight: msg.role === 'user' ? 600 : 400,
                    }}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {/* Typing dots */}
                <div style={{ display: 'flex', gap: 6, padding: '10px 14px', background: 'rgba(255,255,255,0.15)', borderRadius: '4px 14px 14px 14px', width: 'fit-content', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <span className="typing-dot" style={{ background: 'rgba(255,255,255,0.8)' }} />
                  <span className="typing-dot" style={{ background: 'rgba(255,255,255,0.8)' }} />
                  <span className="typing-dot" style={{ background: 'rgba(255,255,255,0.8)' }} />
                </div>
              </div>

              {/* Floating score badge */}
              <div style={{
                position: 'absolute', top: -20, right: -20,
                background: 'white', borderRadius: 16, padding: '12px 16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                animation: 'float 5s ease-in-out infinite 1s',
              }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 2 }}>Lead Score</p>
                <p style={{ fontSize: 24, fontWeight: 900, color: '#10b981', margin: 0 }}>85/100</p>
                <p style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>Highly Qualified ✓</p>
              </div>

              {/* Floating appt badge */}
              <div style={{
                position: 'absolute', bottom: -20, left: -20,
                background: 'white', borderRadius: 16, padding: '12px 16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                animation: 'float 7s ease-in-out infinite 0.5s',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{ width: 36, height: 36, background: '#f0f4ff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={18} color="var(--primary)" />
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 1 }}>Appointment Booked</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Tuesday · 5:30 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.6)', animation: 'float 2s ease-in-out infinite', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
          <ChevronDown size={28} />
        </div>
      </section>

      {/* ============ STATS SECTION ============ */}
      <section style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
              Proven Results
            </p>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
              The numbers speak for themselves
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {stats.map((stat, i) => (
              <div
                key={i}
                style={{
                  background: 'white',
                  borderRadius: 20,
                  padding: '32px 24px',
                  textAlign: 'center',
                  border: '1px solid var(--border)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px rgba(102,126,234,0.15)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = stat.color;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
                }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: stat.color }}>
                  {stat.icon}
                </div>
                <p style={{ fontSize: 36, fontWeight: 900, color: stat.color, letterSpacing: '-0.03em', marginBottom: 6 }}>{stat.value}</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURES SECTION ============ */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(135deg, #f8faff 0%, #fdf5ff 100%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
              Features
            </p>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: '0 0 16px' }}>
              Everything you need to qualify leads at scale
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto' }}>
              From first contact to CRM handover, PropAI handles the entire lead qualification journey.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {features.map((feature, i) => (
              <div
                key={i}
                style={{
                  background: 'white',
                  borderRadius: 20,
                  padding: '28px 24px',
                  border: '1px solid var(--border)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  transition: 'all 0.25s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 16px 48px ${feature.color}20`;
                  (e.currentTarget as HTMLDivElement).style.borderColor = feature.color;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
                }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${feature.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, color: feature.color }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>{feature.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>How It Works</p>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>From lead to appointment in minutes</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { step: '01', title: 'AI-Powered Conversation', desc: 'Lead chats with our AI agent. Questions adapt naturally based on answers to collect all qualification data.', icon: <MessageSquare size={22} />, color: '#667eea' },
              { step: '02', title: 'Instant Lead Scoring', desc: 'AI analyzes responses and calculates a qualification score (0-100) with transparent reasoning.', icon: <BarChart3 size={22} />, color: '#764ba2' },
              { step: '03', title: 'Smart Appointment Booking', desc: 'Qualified leads see available consultant slots and can book instantly based on their preferences.', icon: <Calendar size={22} />, color: '#10b981' },
              { step: '04', title: 'CRM-Ready Handover', desc: 'Complete lead profile with AI sales brief delivered to your team. Ready to close from day one.', icon: <CheckCircle size={22} />, color: '#f59e0b' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 24, alignItems: 'flex-start', padding: '24px', borderRadius: 20, border: '1px solid var(--border)', background: 'white', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${item.color}15`; (e.currentTarget as HTMLDivElement).style.borderColor = item.color; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; }}
              >
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: i < 3 ? 0 : 0 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, position: 'relative' }}>
                    {item.icon}
                    <div style={{ position: 'absolute', top: -8, right: -8, width: 20, height: 20, background: item.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'white' }}>{i + 1}</div>
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: item.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Step {item.step}</p>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Testimonials</p>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>Loved by real estate professionals</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 20, padding: '28px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />)}
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 40, height: 40, background: 'var(--gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'white' }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section style={{ padding: '80px 24px', background: 'var(--gradient)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
        </div>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <h2 style={{ fontSize: 40, fontWeight: 900, color: 'white', marginBottom: 16, letterSpacing: '-0.03em' }}>
            Ready to qualify your next lead?
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', marginBottom: 40, lineHeight: 1.6 }}>
            Start a free AI conversation now. No sign-up required.
          </p>
          <button
            onClick={handleStart}
            style={{
              background: 'white', color: 'var(--primary)', border: 'none',
              borderRadius: 40, padding: '18px 40px', fontSize: 17, fontWeight: 800,
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 12,
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.03)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
          >
            <MessageSquare size={20} />
            Start Free Conversation
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0f0f1a', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 28, height: 28, background: 'var(--gradient)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={16} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 16, color: 'white' }}>PropAI</span>
        </div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
          © 2026 PropAI. AI-Powered Real Estate Lead Qualification System.
        </p>
      </footer>
    </div>
  );
}
