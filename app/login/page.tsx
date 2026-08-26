'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLead } from '@/contexts/LeadContext';
import {
  Building2, User, Shield, Eye, EyeOff, ArrowRight,
  MessageSquare, BarChart3, CheckCircle, Lock, Mail,
  Sparkles, KeyRound
} from 'lucide-react';
import toast from 'react-hot-toast';

type ActivePanel = 'user' | 'admin';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { auth, isAuthenticated, isAdmin, loginAsUser, loginAsAdmin } = useAuth();
  const { updateQualificationData, resetAll } = useLead();

  const initialTab = searchParams.get('tab') === 'admin' ? 'admin' : 'user';
  const [active, setActive] = useState<ActivePanel>(initialTab);

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        router.replace('/admin');
      } else {
        router.replace('/conversation');
      }
    }
  }, [isAuthenticated, isAdmin, router]);

  // User form
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userLoading, setUserLoading] = useState(false);

  // Admin form
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) { toast.error('Please enter your name'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail.trim())) {
      toast.error('Please enter a valid email'); return;
    }
    setUserLoading(true);
    await new Promise(r => setTimeout(r, 600));
    resetAll();
    loginAsUser(userName.trim(), userEmail.trim());
    updateQualificationData({ name: userName.trim(), email: userEmail.trim() });
    toast.success(`Welcome, ${userName.trim()}! 👋`);
    router.push('/conversation');
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    if (!adminUsername.trim() || !adminPassword) {
      setAdminError('Please fill in both username and password'); return;
    }
    setAdminLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const ok = loginAsAdmin(adminUsername.trim(), adminPassword);
    setAdminLoading(false);
    if (ok) {
      toast.success('Welcome back, Admin! 🎉');
      router.push('/admin');
    } else {
      setAdminError('Invalid username or password (use admin / admin123)');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', overflow: 'hidden' }}>

      {/* LEFT PANEL — Branding */}
      <div
        style={{
          width: '42%',
          background: 'var(--gradient)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px 44px',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: -120, right: -80, width: 400, height: 400, background: 'rgba(255,255,255,0.07)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: -100, left: -60, width: 320, height: 320, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        </div>

        {/* Logo */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.2)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}>
            <Building2 size={24} color="white" />
          </div>
          <div>
            <p style={{ fontSize: 22, fontWeight: 900, color: 'white', margin: 0, letterSpacing: '-0.03em' }}>PropAI</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', margin: 0, marginTop: -1 }}>Smart Lead Qualification</p>
          </div>
        </div>

        {/* Middle copy */}
        <div style={{ position: 'relative' }}>
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '6px 14px',
              fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.9)',
              marginBottom: 24, border: '1px solid rgba(255,255,255,0.25)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Sparkles size={12} color="#fde047" />
            AI-Powered Platform
          </div>

          <h1 style={{ fontSize: 40, fontWeight: 900, color: 'white', lineHeight: 1.15, marginBottom: 16, letterSpacing: '-0.03em' }}>
            Real Estate<br />Intelligence<br />Platform
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, marginBottom: 36 }}>
            Qualify leads instantly, score prospects automatically, and manage lead intelligence from the admin portal.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: <MessageSquare size={15} />, label: 'Natural AI Lead Qualification' },
              { icon: <BarChart3 size={15} />, label: 'Instant Lead Scoring & Breakdown' },
              { icon: <Shield size={15} />, label: 'Admin Lead Intelligence Dashboard' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', flexShrink: 0 }}>
                  {f.icon}
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ position: 'relative', display: 'flex', gap: 24 }}>
          {[
            { val: '94%', label: 'Accuracy' },
            { val: '10K+', label: 'Leads' },
            { val: '3.2×', label: 'Conversion' },
          ].map((s, i) => (
            <div key={i}>
              <p style={{ fontSize: 22, fontWeight: 900, color: 'white', margin: 0, letterSpacing: '-0.02em' }}>{s.val}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL — Forms */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f8faff 0%, #fdf5ff 100%)',
          padding: '48px 32px',
          overflowY: 'auto',
        }}
      >
        <div style={{ width: '100%', maxWidth: 440 }}>

          {/* Tab switcher */}
          <div style={{ marginBottom: 36, textAlign: 'center' }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 6 }}>
              Welcome to PropAI
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>
              Select account type to log in
            </p>

            <div
              style={{
                display: 'inline-flex',
                background: 'white',
                borderRadius: 16,
                padding: 5,
                boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                border: '1px solid var(--border)',
              }}
            >
              {([
                { key: 'user', icon: <User size={15} />, label: 'User Login' },
                { key: 'admin', icon: <Shield size={15} />, label: 'Admin Login' },
              ] as { key: ActivePanel; icon: React.ReactNode; label: string }[]).map(tab => (
                <button
                  key={tab.key}
                  id={`tab-${tab.key}`}
                  onClick={() => { setActive(tab.key); setAdminError(''); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '10px 24px',
                    border: 'none',
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    background: active === tab.key ? 'var(--gradient)' : 'transparent',
                    color: active === tab.key ? 'white' : 'var(--text-secondary)',
                    boxShadow: active === tab.key ? '0 4px 14px rgba(102,126,234,0.35)' : 'none',
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* USER FORM */}
          {active === 'user' && (
            <div style={{ animation: 'fadeInUp 0.3s ease' }}>
              <div
                style={{
                  background: 'white',
                  borderRadius: 24,
                  padding: '36px 32px',
                  boxShadow: '0 8px 40px rgba(102,126,234,0.1)',
                  border: '1px solid rgba(102,126,234,0.12)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                  <div style={{ width: 48, height: 48, background: 'var(--gradient)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(102,126,234,0.4)' }}>
                    <User size={22} color="white" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Lead Sign In</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Start your property qualification journey</p>
                  </div>
                </div>

                <form onSubmit={handleUserLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div>
                    <label htmlFor="user-name" style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Full Name
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={15} color="#9ca3af" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      <input
                        id="user-name"
                        type="text"
                        value={userName}
                        onChange={e => setUserName(e.target.value)}
                        placeholder="e.g. John Smith"
                        autoComplete="name"
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 40px',
                          border: '1.5px solid var(--border)',
                          borderRadius: 12,
                          fontSize: 14,
                          outline: 'none',
                          fontFamily: 'inherit',
                          color: 'var(--text-primary)',
                          background: '#fafbff',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="user-email" style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Email Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={15} color="#9ca3af" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      <input
                        id="user-email"
                        type="email"
                        value={userEmail}
                        onChange={e => setUserEmail(e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 40px',
                          border: '1.5px solid var(--border)',
                          borderRadius: 12,
                          fontSize: 14,
                          outline: 'none',
                          fontFamily: 'inherit',
                          color: 'var(--text-primary)',
                          background: '#fafbff',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10, background: '#f0f4ff', borderRadius: 10, padding: '10px 14px', border: '1px solid rgba(102,126,234,0.15)' }}>
                    <Sparkles size={14} color="var(--primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      Your info will be pre-filled into the AI conversation.
                    </p>
                  </div>

                  <button
                    id="user-login-btn"
                    type="submit"
                    disabled={userLoading}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: 'var(--gradient)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 14,
                      fontSize: 15,
                      fontWeight: 800,
                      cursor: userLoading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                      boxShadow: '0 6px 20px rgba(102,126,234,0.4)',
                    }}
                  >
                    {userLoading ? 'Signing in...' : (
                      <>
                        <MessageSquare size={17} />
                        Start Qualification
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ADMIN FORM */}
          {active === 'admin' && (
            <div style={{ animation: 'fadeInUp 0.3s ease' }}>
              <div
                style={{
                  background: 'white',
                  borderRadius: 24,
                  padding: '36px 32px',
                  boxShadow: '0 8px 40px rgba(118,75,162,0.1)',
                  border: '1px solid rgba(118,75,162,0.12)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                  <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #764ba2, #667eea)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(118,75,162,0.4)' }}>
                    <Shield size={22} color="white" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Admin Portal Login</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>View dashboard & lead qualification scores</p>
                  </div>
                </div>

                <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div>
                    <label htmlFor="admin-username" style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Username
                    </label>
                    <div style={{ position: 'relative' }}>
                      <KeyRound size={15} color="#9ca3af" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      <input
                        id="admin-username"
                        type="text"
                        value={adminUsername}
                        onChange={e => { setAdminUsername(e.target.value); setAdminError(''); }}
                        placeholder="admin"
                        autoComplete="username"
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 40px',
                          border: `1.5px solid ${adminError ? '#fca5a5' : 'var(--border)'}`,
                          borderRadius: 12,
                          fontSize: 14,
                          outline: 'none',
                          fontFamily: 'inherit',
                          color: 'var(--text-primary)',
                          background: '#fafbff',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="admin-password" style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={15} color="#9ca3af" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      <input
                        id="admin-password"
                        type={showPassword ? 'text' : 'password'}
                        value={adminPassword}
                        onChange={e => { setAdminPassword(e.target.value); setAdminError(''); }}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        style={{
                          width: '100%',
                          padding: '12px 44px 12px 40px',
                          border: `1.5px solid ${adminError ? '#fca5a5' : 'var(--border)'}`,
                          borderRadius: 12,
                          fontSize: 14,
                          outline: 'none',
                          fontFamily: 'inherit',
                          color: 'var(--text-primary)',
                          background: '#fafbff',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center', padding: 4 }}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {adminError && (
                    <div style={{ display: 'flex', gap: 8, background: '#fef2f2', borderRadius: 10, padding: '10px 14px', border: '1px solid #fecaca' }}>
                      <span style={{ fontSize: 13, color: '#991b1b', fontWeight: 500 }}>⚠ {adminError}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 10, background: '#faf5ff', borderRadius: 10, padding: '10px 14px', border: '1px solid rgba(118,75,162,0.15)' }}>
                    <Shield size={14} color="#764ba2" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <p style={{ fontSize: 12, color: '#764ba2', fontWeight: 700, marginBottom: 2 }}>Demo Admin Credentials</p>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        Username: <code style={{ background: '#f0e8ff', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>admin</code>
                        {' '}· Password: <code style={{ background: '#f0e8ff', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>admin123</code>
                      </p>
                    </div>
                  </div>

                  <button
                    id="admin-login-btn"
                    type="submit"
                    disabled={adminLoading}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: 'linear-gradient(135deg, #764ba2, #667eea)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 14,
                      fontSize: 15,
                      fontWeight: 800,
                      cursor: adminLoading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                      boxShadow: '0 6px 20px rgba(118,75,162,0.4)',
                    }}
                  >
                    {adminLoading ? 'Authenticating...' : (
                      <>
                        <Shield size={17} />
                        Access Admin Dashboard
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <a
              href="/"
              style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5 }}
            >
              ← Back to home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#9ca3af' }}>Loading login...</p>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
