import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { StarRating } from '../components/StarRating';

interface RatingRecord {
  id: string;
  rating: number;
  userId: string;
  storeId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  store?: {
    id: string;
    name: string;
    address: string;
  };
}

export const AdminRatingsPage: React.FC = () => {
  const [ratings, setRatings] = useState<RatingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let isMounted = true;
    api
      .get<RatingRecord[]>('/admin/ratings')
      .then((res) => {
        if (isMounted) setRatings(res.data);
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to load ratings.');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredRatings = ratings.filter((r) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      r.user?.name.toLowerCase().includes(term) ||
      r.user?.email.toLowerCase().includes(term) ||
      r.store?.name.toLowerCase().includes(term) ||
      r.store?.address.toLowerCase().includes(term) ||
      String(r.rating) === term
    );
  });

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <Header searchQuery={search} onSearchChange={(q) => setSearch(q)} />

        <main className="page-content">
          <div className="page-header">
            <div>
              <p className="eyebrow">ADMIN PANEL</p>
              <h1 className="page-title">Manage Ratings</h1>
              <p className="page-subtitle">View all ratings submitted across stores by registered users.</p>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              Loading platform ratings...
            </div>
          ) : error ? (
            <div className="card" style={{ textAlign: 'center', padding: '60px', color: '#ff5252' }}>
              {error}
            </div>
          ) : filteredRatings.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              No ratings found matching your query.
            </div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Store</th>
                      <th>Rating</th>
                      <th>Rating ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRatings.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{r.user?.name || 'Unknown User'}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {r.user?.email || r.userId}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{r.store?.name || 'Unknown Store'}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {r.store?.address || r.storeId}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <StarRating rating={r.rating} size="sm" />
                            <span className="stars-badge">{r.rating} / 5</span>
                          </div>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontFamily: 'monospace' }}>
                          {r.id.substring(0, 13)}...
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
