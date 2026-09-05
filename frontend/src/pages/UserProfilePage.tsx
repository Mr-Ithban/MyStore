import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const UserProfilePage: React.FC = () => {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [address, setAddress] = useState(user?.address || '');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAddress(user.address || '');
    }
  }, [user]);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setSaving(true);
    try {
      await api.patch('/users/me/password', {
        currentPassword,
        newPassword,
      });
      setMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setError(apiErr.response?.data?.message || 'Failed to update password.');
    } finally {
      setSaving(false);
    }
  };

  const getInitial = (n?: string) => (n ? n.charAt(0).toUpperCase() : 'U');

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <Header />

        <main className="page-content">
          <div className="page-header">
            <div>
              <p className="eyebrow">MY ACCOUNT</p>
              <h1 className="page-title">My Profile</h1>
              <p className="page-subtitle">Update your personal information and password.</p>
            </div>
          </div>

          {message && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                marginBottom: '24px',
              }}
            >
              {message}
            </div>
          )}

          {error && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                marginBottom: '24px',
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '28px' }}>
            <div className="card" style={{ textAlign: 'center', padding: '36px 24px' }}>
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ff5722 0%, #ff8a65 100%)',
                  color: 'white',
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: 'var(--shadow-glow)',
                }}
              >
                {getInitial(user?.name)}
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{user?.name}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>
                {user?.email}
              </p>

              <span className={`role-badge ${(user?.role || 'user').toLowerCase()}`} style={{ fontSize: '0.75rem', padding: '4px 12px' }}>
                {user?.role}
              </span>

              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                <span className="eyebrow">ADDRESS</span>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '4px' }}>
                  {user?.address || 'Not specified'}
                </p>
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>Personal Details</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Full name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} readOnly />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={user?.email || ''} readOnly style={{ opacity: 0.7 }} />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} readOnly />
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '28px 0' }} />

              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>Change Password</h3>
              <form onSubmit={handlePasswordChange}>
                <div className="form-group">
                  <label>Current password</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>New password</label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      placeholder="New password (min 8 chars, 1 upper, 1 special)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm new password</label>
                    <input
                      type="password"
                      required
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                  style={{ marginTop: '12px' }}
                >
                  {saving ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
