'use client';

import React, { useState, useRef } from 'react';
import { Send, Mic } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({ onSend, disabled = false, placeholder = 'Type your message...' }: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div
      style={{
        padding: '12px 16px',
        background: 'white',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.04)',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 10,
          alignItems: 'flex-end',
          background: '#f8f9fa',
          borderRadius: 16,
          padding: '8px 8px 8px 16px',
          border: `2px solid ${canSend ? 'var(--primary)' : 'transparent'}`,
          transition: 'border-color 0.2s',
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={disabled ? 'AI is thinking...' : placeholder}
          rows={1}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontSize: 14,
            lineHeight: 1.5,
            color: 'var(--text-primary)',
            fontFamily: 'inherit',
            maxHeight: 120,
            overflow: 'auto',
            padding: '4px 0',
            opacity: disabled ? 0.5 : 1,
          }}
        />

        {/* Send button */}
        <button
          id="chat-send-btn"
          onClick={handleSend}
          disabled={!canSend}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            border: 'none',
            cursor: canSend ? 'pointer' : 'not-allowed',
            background: canSend ? 'var(--gradient)' : '#e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.2s',
            transform: canSend ? 'scale(1)' : 'scale(0.95)',
          }}
        >
          <Send size={16} color="white" />
        </button>
      </div>

      <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
        Press <kbd style={{ background: '#f0f0f0', padding: '1px 5px', borderRadius: 4, fontSize: 10 }}>Enter</kbd> to send · <kbd style={{ background: '#f0f0f0', padding: '1px 5px', borderRadius: 4, fontSize: 10 }}>Shift+Enter</kbd> for new line
      </p>
    </div>
  );
}
