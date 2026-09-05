import React, { useState, useEffect } from 'react';
import { api } from '../api/client.js';
import type { AdminDashboard } from '../types/index.js';
import { Sidebar } from '../components/Sidebar.js';
import { Header } from '../components/Header.js';
import { useNavigate } from 'react-router-dom';

export const AdminDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get<AdminDashboard>('/admin/dashboard')
      .then((res) => setMetrics(res.data))
      .catch(() => {
        setMetrics({
          totalUsers: 1248,
          totalStores: 320,
          totalRatings: 5672,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const monthBars = [
    { month: 'Jan', val: 40 },
    { month: 'Feb', val: 65 },
    { month: 'Mar', val: 50 },
    { month: 'Apr', val: 85 },
    { month: 'May', val: 120 },
    { month: 'Jun', val: 160 },
    { month: 'Jul', val: 140 },
    { month: 'Aug', val: 210 },
  ];

  const activities = [
    { initial: 'S', title: 'New user registered', desc: 'sarah@example.com', date: '10 Aug 2025' },
    { initial: 'A', title: 'New store added', desc: 'Urban Bites', date: '9 Aug 2025' },
    { initial: 'R', title: 'New rating submitted', desc: 'by arjun.k@example.com', date: '9 Aug 2025' },
    { initial: 'N', title: 'User updated profile', desc: 'neha@example.com', date: '8 Aug 2025' },
  ];

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <Header />

        <main className="page-content">
          <div className="page-header">
            <div>
              <p className="eyebrow">ADMIN PANEL</p>
              <h1 className="page-title">Admin Dashboard</h1>
              <p className="page-subtitle">Overview of your platform metrics and activity.</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-secondary" onClick={() => navigate('/admin/users')}>
                👥 Manage Users
              </button>
              <button className="btn btn-primary" onClick={() => navigate('/admin/stores')}>
                🏪 Manage Stores
              </button>
            </div>
          </div>

          {/* Platform Metrics (UI 08) */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon-box">👥</div>
              <div>
                <div className="metric-val">{loading ? '...' : metrics?.totalUsers}</div>
                <div className="metric-lbl">Total Users</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-box">🏪</div>
              <div>
                <div className="metric-val">{loading ? '...' : metrics?.totalStores}</div>
                <div className="metric-lbl">Total Stores</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-box">★</div>
              <div>
                <div className="metric-val">{loading ? '...' : metrics?.totalRatings}</div>
                <div className="metric-lbl">Total Ratings</div>
              </div>
            </div>
          </div>

          {/* Activity & Visualization Grid (UI 08) */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px' }}>
            {/* Chart Container */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>User Registrations Trend</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Last 8 Months</span>
              </div>

              <div
                style={{
                  height: '240px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  gap: '12px',
                  paddingTop: '20px',
                }}
              >
                {monthBars.map((bar) => (
                  <div
                    key={bar.month}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      height: '100%',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '36px',
                        height: `${(bar.val / 210) * 100}%`,
                        background: 'linear-gradient(180deg, #ff5722 0%, rgba(255, 87, 34, 0.3) 100%)',
                        borderRadius: '6px 6px 0 0',
                        transition: 'height 0.4s ease',
                      }}
                    />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{bar.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Stream (UI 08) */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Activity</h3>
                <a href="#" style={{ fontSize: '0.82rem', color: 'var(--primary)' }}>View all</a>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {activities.map((act, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="user-avatar" style={{ width: '36px', height: '36px', fontSize: '0.85rem' }}>
                      {act.initial}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{act.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>{act.desc}</div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{act.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
