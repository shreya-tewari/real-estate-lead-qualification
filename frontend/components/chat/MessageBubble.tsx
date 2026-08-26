'use client';

import React, { useState } from 'react';
import { Message } from '@/types/Message';
import { Copy, Check, Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isAI = message.role === 'ai';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="message-enter"
      style={{
        display: 'flex',
        flexDirection: isAI ? 'row' : 'row-reverse',
        gap: 10,
        marginBottom: 16,
        alignItems: 'flex-end',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: isAI ? 'var(--gradient)' : 'linear-gradient(135deg, #10b981, #059669)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        {isAI ? <Bot size={18} color="white" /> : <User size={18} color="white" />}
      </div>

      {/* Bubble */}
      <div style={{ maxWidth: '72%', position: 'relative' }}>
        <div
          style={{
            background: isAI ? 'white' : 'var(--gradient)',
            color: isAI ? 'var(--text-primary)' : 'white',
            borderRadius: isAI ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
            padding: '12px 16px',
            boxShadow: isAI ? '0 2px 12px rgba(0,0,0,0.06)' : '0 4px 16px rgba(102,126,234,0.35)',
            border: isAI ? '1px solid rgba(0,0,0,0.05)' : 'none',
            fontSize: 14,
            lineHeight: 1.6,
            wordBreak: 'break-word',
          }}
        >
          {message.content}
        </div>

        {/* Timestamp + copy */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 4,
            justifyContent: isAI ? 'flex-start' : 'flex-end',
          }}
        >
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {formatTime(message.timestamp)}
          </span>
          <button
            onClick={handleCopy}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              padding: 2,
              borderRadius: 4,
              transition: 'color 0.2s',
              opacity: 0.7,
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}
            title="Copy message"
          >
            {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
          </button>
        </div>
      </div>
    </div>
  );
}
