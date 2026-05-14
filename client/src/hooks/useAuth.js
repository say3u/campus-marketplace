import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';
import { connectSocket, disconnectSocket } from '../lib/socket';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    api.get('/auth/me')
      .then(r => { setUser(r.data); connectSocket(); })
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    connectSocket();
  }

  async function register(email, username, password) {
    const { data } = await api.post('/auth/register', { email, username, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    connectSocket();
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
    disconnectSocket();
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
