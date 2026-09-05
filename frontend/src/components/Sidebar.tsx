import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user, logout, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isCurrent = (path: string) => location.pathname === path;

  return (
    <aside className="app-sidebar">
      <div className="sidebar-header">
        <div className="brand-logo" onClick={() => navigate('/')}>
          <span className="diamond">◆</span> LocalRate
        </div>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${isCurrent('/') ? 'active' : ''}`}
          onClick={() => navigate('/')}
        >
          <span className="nav-icon">⌂</span> Home
        </button>

        <button
          className={`nav-item ${isCurrent('/explore') ? 'active' : ''}`}
          onClick={() => navigate('/explore')}
        >
          <span className="nav-icon">⌕</span> Explore
        </button>

        {user && (
          <button
            className={`nav-item ${isCurrent('/profile') ? 'active' : ''}`}
            onClick={() => navigate('/profile')}
          >
            <span className="nav-icon">◉</span> Profile
          </button>
        )}

        {role === 'STORE_OWNER' && (
          <button
            className={`nav-item ${isCurrent('/owner/dashboard') ? 'active' : ''}`}
            onClick={() => navigate('/owner/dashboard')}
          >
            <span className="nav-icon">⊞</span> Store Owner Dashboard
          </button>
        )}

        {role === 'ADMIN' && (
          <>
            <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '8px 0' }} />
            <span className="eyebrow" style={{ paddingLeft: '14px', marginBottom: '6px' }}>
              ADMIN PANEL
            </span>
            <button
              className={`nav-item ${isCurrent('/admin/dashboard') ? 'active' : ''}`}
              onClick={() => navigate('/admin/dashboard')}
            >
              <span className="nav-icon">⊞</span> Dashboard
            </button>
            <button
              className={`nav-item ${isCurrent('/admin/users') ? 'active' : ''}`}
              onClick={() => navigate('/admin/users')}
            >
              <span className="nav-icon">👥</span> Manage Users
            </button>
            <button
              className={`nav-item ${isCurrent('/admin/stores') ? 'active' : ''}`}
              onClick={() => navigate('/admin/stores')}
            >
              <span className="nav-icon">🏪</span> Manage Stores
            </button>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item">
          <span className="nav-icon">?</span> Help & Support
        </button>
        {user ? (
          <button className="nav-item" onClick={logout} style={{ color: '#f87171' }}>
            <span className="nav-icon">⇥</span> Logout
          </button>
        ) : (
          <button className="nav-item" onClick={() => navigate('/login')} style={{ color: 'var(--primary)' }}>
            <span className="nav-icon">➔</span> Sign In
          </button>
        )}
      </div>
    </aside>
  );
};
