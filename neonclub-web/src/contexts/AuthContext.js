import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token is valid by making a simple authenticated request
      api.get('/admin/stats')
        .then(response => {
          // If the request succeeds, extract user info from token
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUser({
              id: payload.id,
              email: payload.email,
              role: payload.role,
              name: 'Admin User' // Default name
            });
          } catch (e) {
            localStorage.removeItem('token');
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      console.log('🔍 Attempting login with:', credentials.email);
      const response = await api.post('/auth/login', credentials);
      console.log('✅ Login response:', response.data);

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      setUser(user);

      return { success: true, user };
    } catch (error) {
      console.error('❌ Login error details:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};