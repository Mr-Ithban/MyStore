import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import type { User, UserRole, Paginated } from '../types';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { Modal } from '../components/Modal';

interface ApiError {
  response?: {
    data?: {
      message?: string | string[];
    };
  };
}

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('USER');
  const [modalError, setModalError] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get<Paginated<User>>('/admin/users', {
        params: {
          search: search || undefined,
          role: roleFilter || undefined,
          page,
          limit: 10,
        },
      });
      setUsers(res.data.data);
      setTotalPages(res.data.meta.totalPages);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, page]);

  useEffect(() => {
    let isMounted = true;
    api
      .get<Paginated<User>>('/admin/users', {
        params: {
          search: search || undefined,
          role: roleFilter || undefined,
          page,
          limit: 10,
        },
      })
      .then((res) => {
        if (!isMounted) return;
        setUsers(res.data.data);
        setTotalPages(res.data.meta.totalPages);
      })
      .catch(() => {
        if (!isMounted) return;
        setUsers([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [search, roleFilter, page]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setCreating(true);

    try {
      await api.post('/admin/users', {
        name,
        email,
        address,
        password,
        role,
      });
      setIsAddModalOpen(false);
      setName('');
      setEmail('');
      setAddress('');
      setPassword('');
      setRole('USER');
      fetchUsers();
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      const msg = apiErr.response?.data?.message;
      setModalError(Array.isArray(msg) ? msg.join(', ') : msg || 'Failed to create user.');
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
              <h1 className="page-title">Users</h1>
              <p className="page-subtitle">Manage all users on the platform.</p>
            </div>
            <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
              + Add User
            </button>
          </div>

          <div className="filter-sort-row">
            <div style={{ display: 'flex', gap: '12px', flex: 1, maxWidth: '480px' }}>
              <div className="header-search" style={{ width: '100%' }}>
                <span style={{ color: 'var(--text-subtle)' }}>⌕</span>
                <input
                  placeholder="Search users by name, email or address..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <select
              className="sort-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="USER">User</option>
              <option value="STORE_OWNER">Store Owner</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="data-table-container">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                Loading users...
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Address</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 600 }}>{u.name}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                      <td>
                        <span className={`role-badge ${u.role.toLowerCase()}`}>{u.role}</span>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{u.address}</td>
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
        title="Add New User"
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

        <form onSubmit={handleCreateUser}>
          <div className="form-group">
            <label>Full name</label>
            <input
              type="text"
              required
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              required
              placeholder="user@example.com"
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
            <label>Password</label>
            <input
              type="password"
              required
              minLength={8}
              placeholder="Min 8 chars, 1 uppercase, 1 special char"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
              <option value="USER">User</option>
              <option value="STORE_OWNER">Store Owner</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={creating}
            style={{ width: '100%', marginTop: '12px' }}
          >
            {creating ? 'Creating User...' : 'Add User'}
          </button>
        </form>
      </Modal>
    </div>
  );
};
