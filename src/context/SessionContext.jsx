import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSession, setSession, clearSession } from '../utils/sessionManager.js';
import { login as authLogin, register as authRegister, logout as authLogout } from '../services/authService.js';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [session, setSessionState] = useState(null);

  useEffect(() => {
    try {
      const stored = getSession();
      if (stored) {
        setSessionState(stored);
      }
    } catch {
      setSessionState(null);
    }
  }, []);

  const login = useCallback((username, password) => {
    const result = authLogin(username, password);
    if (result.success) {
      setSessionState(result.session);
    }
    return result;
  }, []);

  const register = useCallback((displayName, username, password, confirmPassword) => {
    const result = authRegister(displayName, username, password, confirmPassword);
    if (result.success) {
      setSessionState(result.session);
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setSessionState(null);
  }, []);

  const isAuthenticated = session !== null;
  const isAdmin = session !== null && session.role === 'admin';

  const value = {
    session,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}