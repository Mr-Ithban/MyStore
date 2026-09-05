/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';
import type { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { name: string; email: string; password: string; address: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('localrate_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('localrate_token'));
  const [loading, setLoading] = useState<boolean>(() => !!localStorage.getItem('localrate_token'));

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('localrate_token');
    localStorage.removeItem('localrate_user');
  };

  const refreshUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get<User>('/auth/me');
      setUser(res.data);
      localStorage.setItem('localrate_user', JSON.stringify(res.data));
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      return;
    }
    let isMounted = true;
    api
      .get<User>('/auth/me')
      .then((res) => {
        if (isMounted) {
          setUser(res.data);
          localStorage.setItem('localrate_user', JSON.stringify(res.data));
        }
      })
      .catch(() => {
        if (isMounted) {
          logout();
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await api.post<{ accessToken: string; user: User }>('/auth/login', {
      email,
      password,
    });
    setToken(res.data.accessToken);
    setUser(res.data.user);
    localStorage.setItem('localrate_token', res.data.accessToken);
    localStorage.setItem('localrate_user', JSON.stringify(res.data.user));
    return res.data.user;
  };

  const register = async (data: { name: string; email: string; password: string; address: string }) => {
    await api.post('/auth/register', data);
    await login(data.email, data.password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role ?? null,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
