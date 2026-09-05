import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import type { OwnerStoreDashboard } from '../types';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { StarRating } from '../components/StarRating';

export const OwnerDashboardPage: React.FC = () => {
  const [stores, setStores] = useState<OwnerStoreDashboard[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    api
      .get<OwnerStoreDashboard[]>('/owner/dashboard')
      .then((res) => {
        if (!isMounted) return;
        setStores(res.data);
        if (res.data.length > 0) {
          setSelectedStoreId(res.data[0].id);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.response?.data?.message || 'Failed to load dashboard.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const activeStore = stores.find((s) => s.id === selectedStoreId) || stores[0];
  const totalReviews = activeStore?.ratings?.length || 0;
  const averageRating = activeStore?.averageRating ?? 'N/A';

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <Header />

        <main className="page-content">
          <div className="page-header">
            <div>
              <p className="eyebrow">STORE OWNER DASHBOARD</p>
              <h1 className="page-title">Welcome, Store Owner</h1>
              <p className="page-subtitle">{"Here's an overview of your store performance."}</p>
            </div>

            {stores.length > 0 && (
              <select
                className="sort-select"
                style={{ padding: '10px 16px', fontSize: '0.92rem' }}
                value={selectedStoreId}
                onChange={(e) => setSelectedStoreId(e.target.value)}
              >
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              Loading store metrics...
            </div>
          ) : error ? (
            <div className="card" style={{ textAlign: 'center', padding: '60px', color: '#ff5252' }}>
              {error}
            </div>
          ) : !activeStore ? (
            <div className="card" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              You do not currently own any registered stores. Contact an Admin to assign a store.
            </div>
          ) : (
            <>
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-icon-box">★</div>
                  <div>
                    <div className="metric-val">{averageRating}</div>
                    <div className="metric-lbl">Average Rating</div>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon-box">💬</div>
                  <div>
                    <div className="metric-val">{totalReviews}</div>
                    <div className="metric-lbl">Total Reviews</div>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon-box">👥</div>
                  <div>
                    <div className="metric-val">{totalReviews}</div>
                    <div className="metric-lbl">Unique Reviewers</div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Recent Reviews</h3>
                  <a href="#" style={{ fontSize: '0.88rem', color: 'var(--primary)' }}>View all</a>
                </div>

                {activeStore.ratings.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>No customer ratings submitted yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {activeStore.ratings.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '16px',
                          paddingBottom: '20px',
                          borderBottom: idx < activeStore.ratings.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                        }}
                      >
                        <div className="user-avatar" style={{ width: '44px', height: '44px' }}>
                          {item.user?.name ? item.user.name.charAt(0) : 'U'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <b style={{ fontSize: '0.95rem' }}>{item.user?.name || 'Anonymous User'}</b>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Recently</span>
                          </div>
                          <div style={{ margin: '4px 0' }}>
                            <StarRating rating={item.rating} size="sm" />
                          </div>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            {item.rating >= 4
                              ? 'Great collection and excellent service!'
                              : 'Fair service, good range of products.'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};
