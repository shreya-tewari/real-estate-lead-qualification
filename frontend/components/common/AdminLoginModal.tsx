'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Eye, EyeOff, Lock, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from './Modal';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const router = useRouter();
  const { loginAsAdmin } = useAuth();

  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');

    if (!adminUsername.trim() || !adminPassword) {
      setAdminError('Please fill in both username and password');
      return;
    }

    setAdminLoading(true);
    // Mimic the 600ms delay from the login page
    await new Promise((resolve) => setTimeout(resolve, 600));

    const success = loginAsAdmin(adminUsername.trim(), adminPassword);
    setAdminLoading(false);

    if (success) {
      toast.success('Welcome back, Admin! 🎉');
      onClose();
      router.push('/admin');
    } else {
      setAdminError('Invalid username or password (use admin / admin123)');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #764ba2, #667eea)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={18} color="white" />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Admin Login</h3>
        </div>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 18 }}>✕</button>
      </div>

      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>
        Enter your credentials to access the admin dashboard.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label htmlFor="modal-admin-username" style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Username
          </label>
          <div style={{ position: 'relative' }}>
            <KeyRound size={15} color="#9ca3af" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              id="modal-admin-username"
              type="text"
              value={adminUsername}
              onChange={(e) => { setAdminUsername(e.target.value); setAdminError(''); }}
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
          <label htmlFor="modal-admin-password" style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <Lock size={15} color="#9ca3af" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              id="modal-admin-password"
              type={showPassword ? 'text' : 'password'}
              value={adminPassword}
              onChange={(e) => { setAdminPassword(e.target.value); setAdminError(''); }}
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
            <p style={{ fontSize: 12, color: '#764ba2', fontWeight: 700, margin: '0 0 2px 0' }}>Demo Admin Credentials</p>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Username: <code style={{ background: '#f0e8ff', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>admin</code>
              {' '}· Password: <code style={{ background: '#f0e8ff', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>admin123</code>
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={adminLoading}
          style={{
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(135deg, #764ba2, #667eea)',
            color: 'white',
            border: 'none',
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 800,
            cursor: adminLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            boxShadow: '0 6px 20px rgba(118,75,162,0.4)',
            marginTop: 8,
            opacity: adminLoading ? 0.7 : 1,
            transition: 'all 0.2s',
          }}
        >
          {adminLoading ? 'Authenticating...' : 'Access Admin Dashboard'}
        </button>
      </form>
    </Modal>
  );
}
