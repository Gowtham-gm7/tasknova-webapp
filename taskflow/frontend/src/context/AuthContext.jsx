import React, { createContext, useState, useEffect } from 'react';
import { getStoredUser, saveStoredUser } from '../utils/storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    saveStoredUser(user);
  }, [user]);

  const login = async (email, password) => {
    const existing = getStoredUser();
    const updated = {
      ...existing,
      email: email || existing.email,
      name: email ? email.split('@')[0] : existing.name
    };
    setUser(updated);
    saveStoredUser(updated);
    return updated;
  };

  const register = async (name, email, password) => {
    const newUser = {
      id: `usr_${Date.now()}`,
      name: name || 'New User',
      email: email || 'user@taskflow.io',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      productivityScore: 80,
      streak: 1,
      dailyGoal: 5,
      badges: [{ id: 'first_task', name: 'First Task', icon: '🏅', unlockedAt: new Date().toISOString() }]
    };
    setUser(newUser);
    saveStoredUser(newUser);
    return newUser;
  };

  const logout = () => {
    // Keep user state populated with demo account so browser never gets locked out
    const demo = getStoredUser();
    setUser(demo);
  };

  const updateProfile = async (data) => {
    const updated = { ...user, ...data };
    setUser(updated);
    saveStoredUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider value={{ user, token: 'local_token', loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
