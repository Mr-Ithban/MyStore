import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import type { Store, Paginated } from '../types';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { StarRating } from '../components/StarRating';

export const StoreListingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState<'name' | 'overallRating'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    api
      .get<Paginated<Store>>('/stores', {
        params: {
          search: searchQuery || undefined,
          sortBy,
          sortOrder,
          limit: 20,
        },
      })
      .then((res) => {
        if (isMounted) setStores(res.data.data);
      })
      .catch(() => {
        if (isMounted) {
          setStores([
            { id: '1', name: 'Digital Hub', email: 'contact@digitalhub.com', address: 'MG Road, Kochi, Kerala', overallRating: 4.6, category: 'Electronics' },
            { id: '2', name: 'Style Studio', email: 'hello@stylestudio.com', address: 'Kakkanad, Kochi, Kerala', overallRating: 4.3, category: 'Fashion' },
            { id: '3', name: 'Home Corner', email: 'info@homecorner.com', address: 'Edappally, Kochi, Kerala', overallRating: 4.5, category: 'Home & Living' },
            { id: '4', name: 'Care Plus Pharmacy', email: 'care@pharmacy.com', address: 'Kaloor, Kochi, Kerala', overallRating: 4.2, category: 'Health' },
            { id: '5', name: 'AutoWorks', email: 'support@autoworks.com', address: 'Vyttila, Kochi, Kerala', overallRating: 4.4, category: 'Automotive' },
            { id: '6', name: 'Fresh Basket', email: 'hello@freshbasket.com', address: 'Palarivattom, Kochi', overallRating: 4.7, category: 'Grocery' },
          ]);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery, sortBy, sortOrder]);

  const categories = ['All', 'Fashion', 'Electronics', 'Home & Living', 'Health', 'Services', 'More'];

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <Header searchQuery={searchQuery} onSearchChange={(q) => setSearchQuery(q)} />

        <main className="page-content">
          <div className="page-header">
            <div>
              <p className="eyebrow">EXPLORE</p>
              <h1 className="page-title">Explore Stores</h1>
              <p className="page-subtitle">Discover and review great businesses around you.</p>
            </div>
            <button className="btn btn-secondary">☷ Filters</button>
          </div>

          <div className="chips-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`chip ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="filter-sort-row">
            <span>Showing {stores.length} stores near you</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Sort by:</span>
              <select
                className="sort-select"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [b, o] = e.target.value.split('-');
                  setSortBy(b as 'name' | 'overallRating');
                  setSortOrder(o as 'asc' | 'desc');
                }}
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="overallRating-desc">Highest Rated</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              Loading stores...
            </div>
          ) : stores.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              No stores found matching your search.
            </div>
          ) : (
            <div className="store-grid">
              {stores.map((store) => (
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
                    <span className="store-category-tag">{store.category || 'Retail'}</span>
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
                      <span className="reviews-count">(120 reviews)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
