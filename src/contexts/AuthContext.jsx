import { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { defaultAdmin } from '../data/schedule';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auto-login from persisted session
    const session = storage.get('session');
    if (session) {
      const users = storage.get('users', []);
      const found = users.find(u => u.id === session.id) ||
        (session.id === 'admin' ? defaultAdmin : null);
      if (found) setUser(found);
    }
    setLoading(false);
  }, []);

  const register = ({ name, email, password, phone }) => {
    const users = storage.get('users', []);
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'E-mail já cadastrado.' };
    }
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      phone: phone || '',
      role: 'client',
      createdAt: new Date().toISOString(),
      preferredColor: null,
    };
    storage.set('users', [...users, newUser]);
    storage.set('session', { id: newUser.id });
    setUser(newUser);
    return { success: true };
  };

  const login = ({ email, password }) => {
    // Check admin
    if (email === defaultAdmin.email && password === defaultAdmin.password) {
      storage.set('session', { id: defaultAdmin.id });
      setUser(defaultAdmin);
      return { success: true };
    }
    const users = storage.get('users', []);
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { success: false, error: 'E-mail ou senha incorretos.' };
    storage.set('session', { id: found.id });
    setUser(found);
    return { success: true };
  };

  const logout = () => {
    storage.remove('session');
    setUser(null);
  };

  const updateUser = (updates) => {
    if (!user) return;
    const users = storage.get('users', []);
    const updated = { ...user, ...updates };
    const newUsers = users.map(u => u.id === user.id ? updated : u);
    storage.set('users', newUsers);
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
