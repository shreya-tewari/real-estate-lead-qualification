'use client';

import React from 'react';
import { Calendar, Clock, Star, Award } from 'lucide-react';
import { SelectedAppointment } from '@/types/Lead';

export interface TimeSlot {
  id: string;
  dayLabel: string;
  date: string;
  time: string;
  available: boolean;
  consultant: string;
  consultantTitle: string;
  consultantRating: number;
  tag?: string;
}

interface TimeSlotsProps {
  slots: TimeSlot[];
  selected: string | null;
  onSelect: (slot: TimeSlot) => void;
}

export default function TimeSlots({ slots, selected, onSelect }: TimeSlotsProps) {
  const grouped: Record<string, TimeSlot[]> = {};
  slots.forEach(s => {
    if (!grouped[s.dayLabel]) grouped[s.dayLabel] = [];
    grouped[s.dayLabel].push(s);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {Object.entries(grouped).map(([day, daySlots]) => (
        <div key={day}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Calendar size={15} color="var(--primary)" />
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{day}</h3>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{daySlots.filter(s => s.available).length} available</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {daySlots.map(slot => (
              <SlotCard
                key={slot.id}
                slot={slot}
                isSelected={selected === slot.id}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface SlotCardProps {
  slot: TimeSlot;
  isSelected: boolean;
  onSelect: (slot: TimeSlot) => void;
}

function SlotCard({ slot, isSelected, onSelect }: SlotCardProps) {
  return (
    <button
      onClick={() => slot.available && onSelect(slot)}
      disabled={!slot.available}
      style={{
        background: isSelected ? 'var(--gradient)' : slot.available ? 'white' : '#f9f9f9',
        border: `2px solid ${isSelected ? 'transparent' : slot.available ? 'var(--border)' : '#f0f0f0'}`,
        borderRadius: 14,
        padding: '14px 16px',
        cursor: slot.available ? 'pointer' : 'not-allowed',
        textAlign: 'left',
        transition: 'all 0.2s ease',
        opacity: slot.available ? 1 : 0.5,
        boxShadow: isSelected ? '0 8px 24px rgba(102,126,234,0.35)' : slot.available ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        if (slot.available && !isSelected) {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--primary)';
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(102,126,234,0.15)';
        }
      }}
      onMouseLeave={e => {
        if (!isSelected) {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
        }
      }}
    >
      {slot.tag && (
        <span style={{
          position: 'absolute', top: 8, right: 8,
          fontSize: 10, fontWeight: 700,
          padding: '2px 8px',
          borderRadius: 20,
          background: isSelected ? 'rgba(255,255,255,0.25)' : 'var(--gradient)',
          color: 'white',
        }}>
          {slot.tag}
        </span>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <Clock size={13} color={isSelected ? 'rgba(255,255,255,0.8)' : 'var(--primary)'} />
        <span style={{ fontSize: 16, fontWeight: 800, color: isSelected ? 'white' : 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          {slot.time}
        </span>
      </div>

      <p style={{ fontSize: 12, fontWeight: 700, color: isSelected ? 'rgba(255,255,255,0.9)' : 'var(--text-secondary)', marginBottom: 4 }}>
        {slot.consultant}
      </p>
      <p style={{ fontSize: 11, color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}>
        {slot.consultantTitle}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 8 }}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={10}
            fill={i < slot.consultantRating ? (isSelected ? 'rgba(255,255,255,0.9)' : '#f59e0b') : 'none'}
            color={i < slot.consultantRating ? (isSelected ? 'rgba(255,255,255,0.9)' : '#f59e0b') : (isSelected ? 'rgba(255,255,255,0.3)' : '#d1d5db')}
          />
        ))}
        <span style={{ fontSize: 10, color: isSelected ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)', marginLeft: 3 }}>
          {slot.consultantRating}.0
        </span>
      </div>

      {!slot.available && (
        <p style={{ fontSize: 11, fontWeight: 600, color: '#ef4444', marginTop: 6 }}>
          Fully booked
        </p>
      )}
    </button>
  );
}
