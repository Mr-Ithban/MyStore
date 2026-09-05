import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import type { Store } from '../types';
import { StarRating } from '../components/StarRating';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [featuredStores, setFeaturedStores] = useState<Store[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get<{ data: Store[] }>('/stores?limit=6')
      .then((res) => setFeaturedStores(res.data.data))
      .catch(() => {});
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/explore?search=${encodeURIComponent(search)}`);
  };

  const categories = [
    { name: 'Fashion', icon: '♧' },
    { name: 'Electronics', icon: '▣' },
    { name: 'Home & Living', icon: '⌂' },
    { name: 'Health & Wellness', icon: '♡' },
    { name: 'More', icon: '•••' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-app)' }}>
      {/* Landing Navbar */}
      <header className="landing-nav">
        <div className="brand-logo" onClick={() => navigate('/')}>
          <span className="diamond">◆</span> LocalRate
        </div>

        <nav style={{ display: 'flex', gap: '28px', color: 'var(--text-muted)', fontWeight: 500 }}>
          <a href="#" style={{ color: 'var(--text-main)' }}>Home</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/explore'); }}>Explore</a>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            About
          </a>
        </nav>

        {user ? (
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
            onClick={() => navigate('/profile')}
          >
            <div
              className="user-avatar"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
              }}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{user.role}</span>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/signup')}>
              Sign Up
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div>
          <p className="eyebrow">YOUR LOCAL GUIDE</p>
          <h1 className="hero-headline">
            Discover <em>Trusted Stores</em> Near You
          </h1>
          <p className="hero-desc">
            Real people. Real experiences. Find, review and support the best local businesses in your city.
          </p>

          <form className="hero-search-box" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search for stores, categories or locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ borderRadius: 'var(--radius-pill)', padding: '12px 28px' }}>
              Search
            </button>
          </form>
        </div>

        <div style={{ position: 'relative' }}>
          <div
            style={{
              height: '380px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, #1c2536 0%, #0d121c 100%)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-lg)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ opacity: 0.15, fontSize: '10rem', position: 'absolute' }}>🏪</div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, textAlign: 'center', zIndex: 1 }}>
              FIND WHAT<br />YOU LOVE
            </h3>
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      <section style={{ padding: '0 64px 60px', maxWidth: '1400px', margin: '0 auto' }}>
        <p className="eyebrow">BROWSE BY CATEGORY</p>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '24px' }}>Everything worth discovering.</h2>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat.name}
              className="chip"
              onClick={() => navigate(`/explore?category=${encodeURIComponent(cat.name)}`)}
              style={{ padding: '12px 24px', fontSize: '0.95rem' }}
            >
              <span style={{ marginRight: '8px', color: 'var(--primary)' }}>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Stats Bar (UI 01) */}
      <section id="about" className="landing-stats-bar">
        <div>
          <div className="stat-number">5K+</div>
          <div className="stat-label">Stores Listed</div>
        </div>
        <div>
          <div className="stat-number">25K+</div>
          <div className="stat-label">Verified Reviews</div>
        </div>
        <div>
          <div className="stat-number">10K+</div>
          <div className="stat-label">Active Users</div>
        </div>
        <div>
          <div className="stat-number">4.8</div>
          <div className="stat-label">Average Platform Rating</div>
        </div>
      </section>

      {/* Featured Stores Section */}
      <section style={{ padding: '60px 64px 80px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
          <div>
            <p className="eyebrow">TOP RATED</p>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Featured Businesses</h2>
          </div>
          <button className="btn btn-secondary" onClick={() => navigate('/explore')}>
            View All Stores →
          </button>
        </div>

        <div className="store-grid">
          {featuredStores.slice(0, 4).map((store) => (
            <div
              key={store.id}
              className="store-card"
              onClick={() => navigate(`/stores/${store.id}`)}
            >
              <div
                className="store-thumb"
                style={{
                  background: 'linear-gradient(135deg, #1f293d 0%, #111726 100%)',
                }}
              >
                <span className="store-category-tag">Store</span>
                <button className="fav-btn" onClick={(e) => e.stopPropagation()}>
                  ♡
                </button>
              </div>
              <div className="store-body">
                <h3 className="store-title">{store.name}</h3>
                <div className="store-address">⌖ {store.address}</div>
                <div className="store-rating-row">
                  <StarRating rating={store.overallRating ?? 0} size="sm" />
                  <span className="stars-badge">{store.overallRating ?? 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
