'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Badge from '@/components/common/Badge';
import { useLead } from '@/contexts/LeadContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import {
  Users, TrendingUp, Calendar, Clock, MapPin, BarChart3,
  CheckCircle, AlertCircle, XCircle, ArrowUpRight, ArrowDownRight,
  Eye, MessageSquare, RefreshCw, Star, Filter
} from 'lucide-react';

const mockLeads = [
  { id: 1, name: 'Aisha Al-Rashid', email: 'aisha@example.com', location: 'Dubai Marina', score: 88, status: 'Highly Qualified', type: 'Investment', budget: '$650K', time: '2 min ago' },
  { id: 2, name: 'James Wilson', email: 'james@example.com', location: 'Downtown Dubai', score: 72, status: 'Partially Qualified', type: 'Personal', budget: '$420K', time: '15 min ago' },
  { id: 3, name: 'Priya Patel', email: 'priya@example.com', location: 'Abu Dhabi', score: 91, status: 'Highly Qualified', type: 'Investment', budget: '$1.2M', time: '32 min ago' },
  { id: 4, name: 'Carlos Rodriguez', email: 'carlos@example.com', location: 'Palm Jumeirah', score: 45, status: 'Not Qualified', type: 'Personal', budget: 'TBD', time: '1 hr ago' },
  { id: 5, name: 'Sarah Chen', email: 'sarah@example.com', location: 'Business Bay', score: 83, status: 'Highly Qualified', type: 'Investment', budget: '$800K', time: '2 hr ago' },
  { id: 6, name: 'Mohammed Al-Farsi', email: 'moh@example.com', location: 'Dubai Hills', score: 67, status: 'Partially Qualified', type: 'Both', budget: '$550K', time: '3 hr ago' },
];

const locationData = [
  { location: 'Dubai Marina', count: 34, pct: 80 },
  { location: 'Downtown Dubai', count: 28, pct: 66 },
  { location: 'Palm Jumeirah', count: 22, pct: 52 },
  { location: 'Abu Dhabi', count: 18, pct: 43 },
  { location: 'Business Bay', count: 15, pct: 36 },
  { location: 'Dubai Hills', count: 12, pct: 29 },
];

const timeSlotPerf = [
  { slot: '9:00 AM', bookings: 18, color: '#667eea' },
  { slot: '11:00 AM', bookings: 14, color: '#667eea' },
  { slot: '1:00 PM', bookings: 9, color: '#667eea' },
  { slot: '3:00 PM', bookings: 11, color: '#667eea' },
  { slot: '5:30 PM', bookings: 16, color: '#667eea' },
];

const maxBookings = Math.max(...timeSlotPerf.map(s => s.bookings));

export default function AdminPage() {
  const { isLoading } = useAuthGuard(true); // admin-only route
  const { resetAll } = useLead();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [leads, setLeads] = useState<any[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/leads')
      .then(res => res.json())
      .then(data => {
        setLeads(data);
        setLoadingLeads(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingLeads(false);
      });
  }, []);

  // Render a neutral loader while auth hydrates — prevents flash redirect
  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '4px solid #f0f0f0', borderTopColor: '#667eea', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ fontSize: 14, color: '#9ca3af', fontWeight: 500 }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const displayLeads = leads.length > 0 ? leads : (loadingLeads ? [] : mockLeads);
  const filteredLeads = filterStatus === 'all' ? displayLeads : displayLeads.filter(l => (l.qualification_status || l.status) === filterStatus);

  const stats = [
    { label: 'Total Leads Today', value: '147', change: '+12%', up: true, icon: <Users size={20} />, color: '#667eea' },
    { label: 'Highly Qualified', value: '89', change: '+8%', up: true, icon: <CheckCircle size={20} />, color: '#10b981' },
    { label: 'Conversion Rate', value: '60.5%', change: '+3.2%', up: true, icon: <TrendingUp size={20} />, color: '#f59e0b' },
    { label: 'Avg. Score', value: '74.2', change: '-1.4', up: false, icon: <BarChart3 size={20} />, color: '#764ba2' },
    { label: 'Appointments Today', value: '34', change: '+5', up: true, icon: <Calendar size={20} />, color: '#8b5cf6' },
    { label: 'Avg. Qualify Time', value: '4m 12s', change: '-30s', up: true, icon: <Clock size={20} />, color: '#ec4899' },
  ];

  const statusBadge = (status: string) => {
    if (status === 'Highly Qualified') return <Badge label={status} variant="success" dot size="sm" />;
    if (status === 'Partially Qualified') return <Badge label={status} variant="warning" dot size="sm" />;
    return <Badge label={status} variant="danger" dot size="sm" />;
  };

  const scoreColor = (score: number) => score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Header showBreadcrumb adminLink />

      {/* Page header */}
      <div style={{ background: 'var(--gradient)', padding: '28px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
        </div>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Admin Dashboard</p>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'white', margin: 0 }}>Lead Intelligence Center</h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <button
            onClick={() => { resetAll(); window.location.href = '/conversation'; }}
            style={{
              background: 'white', color: 'var(--primary)', border: 'none', borderRadius: 12,
              padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            }}
          >
            <MessageSquare size={15} />
            New Lead
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16, marginBottom: 28 }}>
          {stats.map((stat, i) => (
            <div
              key={i}
              style={{ background: 'white', borderRadius: 16, padding: '20px 16px', border: '1px solid var(--border)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', transition: 'all 0.2s', cursor: 'default' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px ${stat.color}20`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 10px rgba(0,0,0,0.04)'; }}
            >
              <div style={{ width: 36, height: 36, background: `${stat.color}15`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, marginBottom: 12 }}>
                {stat.icon}
              </div>
              <p style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 4 }}>{stat.value}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{stat.label}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: stat.up ? '#10b981' : '#ef4444' }}>
                {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change} vs yesterday
              </div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 28 }}>

          {/* Location breakdown */}
          <div style={{ background: 'white', borderRadius: 20, padding: '24px', border: '1px solid var(--border)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <MapPin size={16} color="var(--primary)" />
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Leads by Location</h2>
              <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>This month</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {locationData.map((loc, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{loc.location}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{loc.count}</span>
                  </div>
                  <div style={{ height: 8, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${loc.pct}%`, background: 'var(--gradient)', borderRadius: 4, transition: 'width 0.8s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Time slot performance */}
          <div style={{ background: 'white', borderRadius: 20, padding: '24px', border: '1px solid var(--border)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <Clock size={16} color="var(--primary)" />
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Top Time Slots</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {timeSlotPerf.map((slot, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', width: 60, flexShrink: 0 }}>{slot.slot}</span>
                  <div style={{ flex: 1, height: 28, background: '#f8f9fa', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                    <div style={{ height: '100%', width: `${(slot.bookings / maxBookings) * 100}%`, background: 'var(--gradient)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8, transition: 'width 0.8s ease' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'white' }}>{slot.bookings}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Donut chart mock */}
            <div style={{ marginTop: 24, padding: '16px', background: '#f8f9fa', borderRadius: 14 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Lead Status Split</p>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { label: 'Qualified', pct: 61, color: '#10b981' },
                  { label: 'Partial', pct: 24, color: '#f59e0b' },
                  { label: 'Not Qual.', pct: 15, color: '#ef4444' },
                ].map((item, i) => (
                  <div key={i} style={{ flex: item.pct, height: 8, background: item.color, borderRadius: i === 0 ? '4px 0 0 4px' : i === 2 ? '0 4px 4px 0' : '0', opacity: 0.85 }} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                {[
                  { label: 'Highly Qualified', color: '#10b981', pct: '61%' },
                  { label: 'Partial', color: '#f59e0b', pct: '24%' },
                  { label: 'Not Qual.', color: '#ef4444', pct: '15%' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 8, height: 8, background: item.color, borderRadius: '50%' }} />
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.label}: <strong>{item.pct}</strong></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent leads table */}
        <div style={{ background: 'white', borderRadius: 20, border: '1px solid var(--border)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f5f5f5', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={16} color="var(--primary)" />
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Recent Leads</h2>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', background: '#f0f0f0', padding: '2px 8px', borderRadius: 20 }}>{filteredLeads.length} leads</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['all', 'Highly Qualified', 'Partially Qualified', 'Not Qualified'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilterStatus(f)}
                  style={{
                    padding: '5px 12px',
                    border: 'none',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: filterStatus === f ? 'var(--gradient)' : '#f5f5f5',
                    color: filterStatus === f ? 'white' : 'var(--text-secondary)',
                    transition: 'all 0.2s',
                  }}
                >
                  {f === 'all' ? 'All' : f.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#fafafa' }}>
                  {['Lead Name', 'Location', 'Score', 'Status', 'Buyer Type', 'Budget', 'Time', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead, i) => (
                  <tr
                    key={lead.id}
                    style={{ borderTop: '1px solid #f5f5f5', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#fafbff'}
                    onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, background: 'var(--gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{lead.name}</p>
                          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <MapPin size={12} color="var(--text-muted)" />
                        {lead.location || 'N/A'}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 32, height: 4, background: '#f0f0f0', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ width: `${lead.qualification_score || lead.score || 0}%`, height: '100%', background: scoreColor(lead.qualification_score || lead.score || 0) }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{lead.qualification_score || lead.score || 0}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {statusBadge(lead.qualification_status || lead.status || 'Not Qualified')}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>
                      {lead.buyer_type || lead.type || 'N/A'}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {lead.budget ? `$${lead.budget.toLocaleString()}` : lead.budget === 0 ? 'TBD' : (lead.budget || 'N/A')}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-muted)' }}>
                      {lead.created_at ? new Date(lead.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : lead.time}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          style={{ padding: '5px 10px', background: '#f0f4ff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.2s' }}
                          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#e0e8ff'}
                          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = '#f0f4ff'}
                        >
                          <Eye size={12} />
                          View
                        </button>
                        <button
                          style={{ padding: '5px 10px', background: '#f0fdf4', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#10b981', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.2s' }}
                          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#dcfce7'}
                          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = '#f0fdf4'}
                        >
                          <Calendar size={12} />
                          Book
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
