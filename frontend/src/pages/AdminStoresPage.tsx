import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import type { Store, User, Paginated } from '../types';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { Modal } from '../components/Modal';
import { StarRating } from '../components/StarRating';

interface ApiError {
  response?: {
    data?: {
      message?: string | string[];
    };
  };
}

export const AdminStoresPage: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [storeOwners, setStoreOwners] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [modalError, setModalError] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchStores = useCallback(async () => {
    try {
      const res = await api.get<Paginated<Store>>('/admin/stores', {
        params: {
          search: search || undefined,
          page,
          limit: 10,
        },
      });
      setStores(res.data.data);
      setTotalPages(res.data.meta.totalPages);
    } catch {
      // Fallback
    }
  }, [search, page]);

  useEffect(() => {
    let isMounted = true;
    api
      .get<Paginated<Store>>('/admin/stores', {
        params: {
          search: search || undefined,
          page,
          limit: 10,
        },
      })
      .then((res) => {
        if (!isMounted) return;
        setStores(res.data.data);
        setTotalPages(res.data.meta.totalPages);
      })
      .catch(() => {
        if (!isMounted) return;
        setStores([
          { id: '1', name: 'Digital Hub', email: 'contact@digitalhub.com', address: 'MG Road, Kochi', overallRating: 4.6 },
          { id: '2', name: 'Style Studio', email: 'hello@stylestudio.com', address: 'Kakkanad, Kochi', overallRating: 4.3 },
          { id: '3', name: 'Home Corner', email: 'info@homecorner.com', address: 'Edappally, Kochi', overallRating: 4.5 },
          { id: '4', name: 'Care Plus Pharmacy', email: 'care@pharmacy.com', address: 'Kaloor, Kochi', overallRating: 4.2 },
          { id: '5', name: 'AutoWorks', email: 'support@autoworks.com', address: 'Vyttila, Kochi', overallRating: 4.4 },
          { id: '6', name: 'Fresh Basket', email: 'hello@freshbasket.com', address: 'Palarivattom, Kochi', overallRating: 4.7 },
        ]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [search, page]);

  useEffect(() => {
    let isMounted = true;
    api
      .get<Paginated<User>>('/admin/users', {
        params: { role: 'STORE_OWNER', limit: 100 },
      })
      .then((res) => {
        if (!isMounted) return;
        setStoreOwners(res.data.data);
        if (res.data.data.length > 0) {
          setOwnerId(res.data.data[0].id);
        }
      })
      .catch(() => {
        // Fallback
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setCreating(true);

    try {
      await api.post('/admin/stores', {
        name,
        email,
        address,
        ownerId,
      });
      setIsAddModalOpen(false);
      setName('');
      setEmail('');
      setAddress('');
      fetchStores();
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      const msg = apiErr.response?.data?.message;
      setModalError(Array.isArray(msg) ? msg.join(', ') : msg || 'Failed to create store.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <Header />

        <main className="page-content">
          <div className="page-header">
            <div>
              <p className="eyebrow">ADMIN MANAGEMENT</p>
              <h1 className="page-title">Stores</h1>
              <p className="page-subtitle">Manage all stores on the platform.</p>
            </div>
            <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
              + Add Store
            </button>
          </div>

          <div className="filter-sort-row">
            <div style={{ display: 'flex', gap: '12px', flex: 1, maxWidth: '480px' }}>
              <div className="header-search" style={{ width: '100%' }}>
                <span style={{ color: 'var(--text-subtle)' }}>⌕</span>
                <input
                  placeholder="Search stores by name, email or address..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="data-table-container">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                Loading stores...
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Rating</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((s) => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 600 }}>{s.name}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{s.email}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{s.address}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <StarRating rating={s.overallRating ?? 0} size="sm" />
                          <span style={{ fontWeight: 700, color: 'var(--star-gold)' }}>
                            {s.overallRating ?? 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn-icon">✎</button>
                        <button className="btn-icon" style={{ color: '#f87171' }}>🗑</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="pagination-bar">
              <span>Page {page} of {totalPages || 1}</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Store"
      >
        {modalError && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: '0.85rem',
              marginBottom: '16px',
            }}
          >
            {modalError}
          </div>
        )}

        <form onSubmit={handleCreateStore}>
          <div className="form-group">
            <label>Store Name</label>
            <input
              type="text"
              required
              placeholder="Enter store name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Store Email</label>
            <input
              type="email"
              required
              placeholder="store@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              required
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Assign Store Owner</label>
            {storeOwners.length === 0 ? (
              <input
                type="text"
                required
                placeholder="Enter Owner UUID"
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
              />
            ) : (
              <select value={ownerId} onChange={(e) => setOwnerId(e.target.value)}>
                {storeOwners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name} ({owner.email})
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={creating}
            style={{ width: '100%', marginTop: '12px' }}
          >
            {creating ? 'Creating Store...' : 'Add Store'}
          </button>
        </form>
      </Modal>
    </div>
  );
};
