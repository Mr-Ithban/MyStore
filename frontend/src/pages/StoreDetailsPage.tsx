import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import type { Store } from '../types';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { StarRating } from '../components/StarRating';

export const StoreDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [store, setStore] = useState<Store | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'location'>('overview');
  const [userRating, setUserRating] = useState<number>(0);
  const [hasRated, setHasRated] = useState<boolean>(false);
  const [submittingRating, setSubmittingRating] = useState<boolean>(false);
  const [ratingMessage, setRatingMessage] = useState<string>('');

  const fetchStoreDetails = useCallback(async () => {
    if (!id) return;
    try {
      const res = await api.get<Store>(`/stores/${id}`);
      setStore(res.data);
      if (res.data.userRating) {
        setUserRating(res.data.userRating);
        setHasRated(true);
      }
    } catch {
      setStore(null);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    api
      .get<Store>(`/stores/${id}`)
      .then((res) => {
        if (!isMounted) return;
        setStore(res.data);
        if (res.data.userRating) {
          setUserRating(res.data.userRating);
          setHasRated(true);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setStore(null);
      });
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleRatingSubmit = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!id || userRating === 0) return;

    setSubmittingRating(true);
    setRatingMessage('');
    try {
      if (hasRated) {
        await api.patch(`/ratings/${id}`, { rating: userRating });
        setRatingMessage('Your rating has been updated!');
      } else {
        await api.post('/ratings', { storeId: id, rating: userRating });
        setHasRated(true);
        setRatingMessage('Thank you for submitting your rating!');
      }
      fetchStoreDetails();
    } catch (err) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to submit rating.';
      setRatingMessage(errorMsg);
    } finally {
      setSubmittingRating(false);
    }
  };

  if (!store) {
    return (
      <div className="app-layout">
        <Sidebar />
        <div className="app-main">
          <Header />
          <div className="page-content" style={{ textAlign: 'center', padding: '60px' }}>
            Loading store details...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <Header />

        <main className="page-content">
          <div className="store-detail-banner">
            <div className="store-detail-info">
              <span className="eyebrow">ELECTRONICS • KOCHI</span>
              <h1>{store.name}</h1>
              <div className="store-detail-meta">
                <StarRating rating={store.overallRating ?? 0} />
                <span style={{ fontWeight: 700, color: 'var(--star-gold)' }}>
                  {store.overallRating ?? 'N/A'}
                </span>
                <span>(120 reviews)</span>
                <span>• ⌖ {store.address}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-secondary">♡ Save</button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  const elem = document.getElementById('rate-box');
                  elem?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Write a Review
              </button>
            </div>
          </div>

          <div className="tab-menu">
            <button
              className={`tab-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`tab-item ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
            <button
              className={`tab-item ${activeTab === 'location' ? 'active' : ''}`}
              onClick={() => setActiveTab('location')}
            >
              Location
            </button>
          </div>

          <div className="store-detail-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="card">
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>About</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Your one-stop destination for the latest electronics, accessories and expert advice. Quality products, trusted service. Better technology for a brighter tomorrow.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
                  <div>
                    <span className="eyebrow">ADDRESS</span>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '4px' }}>{store.address}</p>
                  </div>
                  <div>
                    <span className="eyebrow">HOURS</span>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '4px' }}>Open 9:00 AM - 9:00 PM</p>
                  </div>
                  <div>
                    <span className="eyebrow">CONTACT</span>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '4px' }}>{store.email}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>Customer Reviews</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { name: 'Sarah Mathew', rating: 5, text: 'Great collection and excellent service! Highly recommended.', date: '12 Aug 2025' },
                    { name: 'Arjun K', rating: 4, text: 'Very helpful staff and genuine products. Good experience overall.', date: '10 Aug 2025' },
                    { name: 'Neha S', rating: 5, text: 'Best place for electronics in Kochi! Friendly staff.', date: '8 Aug 2025' },
                  ].map((rev, i) => (
                    <div key={i} style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <b style={{ fontSize: '0.95rem' }}>{rev.name}</b>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>{rev.date}</span>
                      </div>
                      <StarRating rating={rev.rating} size="sm" />
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '6px' }}>{rev.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="card rating-summary-card">
                <div className="big-rating-number">{store.overallRating ?? '4.6'}</div>
                <div className="rating-out-of">out of 5</div>

                {[
                  { star: 5, pct: 72 },
                  { star: 4, pct: 20 },
                  { star: 3, pct: 6 },
                  { star: 2, pct: 1 },
                  { star: 1, pct: 1 },
                ].map((row) => (
                  <div key={row.star} className="rating-bar-row">
                    <span>{row.star} ★</span>
                    <div className="rating-bar-bg">
                      <div className="rating-bar-fill" style={{ width: `${row.pct}%` }} />
                    </div>
                    <span>{row.pct}%</span>
                  </div>
                ))}
              </div>

              <div className="card" id="rate-box" style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  {hasRated ? 'Your Submitted Rating' : 'Rate this Store'}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Select 1 to 5 stars to share your experience
                </p>

                <div style={{ margin: '16px 0' }}>
                  <StarRating
                    rating={userRating}
                    interactive
                    onRatingChange={(n) => setUserRating(n)}
                    size="lg"
                  />
                </div>

                {ratingMessage && (
                  <div style={{ fontSize: '0.84rem', color: 'var(--primary)', marginBottom: '12px' }}>
                    {ratingMessage}
                  </div>
                )}

                <button
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  disabled={submittingRating || userRating === 0}
                  onClick={handleRatingSubmit}
                >
                  {submittingRating ? 'Submitting...' : hasRated ? 'Update Rating' : 'Submit Rating'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
