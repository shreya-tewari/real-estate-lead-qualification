'use client';

import React from 'react';
import { Bot } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div
      className="message-enter"
      style={{ display: 'flex', gap: 10, alignItems: 'flex-end', marginBottom: 16 }}
    >
      {/* AI avatar */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'var(--gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        <Bot size={18} color="white" />
      </div>

      {/* Dots bubble */}
      <div
        style={{
          background: 'white',
          borderRadius: '4px 16px 16px 16px',
          padding: '14px 18px',
          display: 'flex',
          gap: 5,
          alignItems: 'center',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}
