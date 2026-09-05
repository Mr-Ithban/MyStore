import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ searchQuery = '', onSearchChange }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getInitial = (name: string) => (name ? name.charAt(0).toUpperCase() : 'U');

  const getRoleClass = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return 'role-badge admin';
      case 'STORE_OWNER':
        return 'role-badge store_owner';
      default:
        return 'role-badge user';
    }
  };

  return (
    <header className="app-header">
      <div className="header-search">
        <span style={{ color: 'var(--text-subtle)', fontSize: '1rem' }}>⌕</span>
        <input
          type="text"
          placeholder="Search for stores, locations or categories..."
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      <div className="header-actions">
        <div className="location-picker">
          <span style={{ color: 'var(--primary)' }}>⌖</span> Kochi <span>⌄</span>
        </div>

        {user ? (
          <div className="user-profile-badge" onClick={() => navigate('/profile')}>
            <div className="user-avatar">{getInitial(user.name)}</div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className={getRoleClass(user.role)}>
                {user.role === 'STORE_OWNER' ? 'Store Owner' : user.role}
              </span>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/signup')}>
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
