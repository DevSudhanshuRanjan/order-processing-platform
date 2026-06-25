import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [role, setRole] = useState(() => localStorage.getItem('role') || null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', role);
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      setIsLoggedIn(false);
    }
  }, [token, user, role]);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setRole(userData.role);
    setToken(jwtToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setRole(null);
    // Also remove cart if any (this will be handled/cleared by a coordinated hook/dispatch or simply by localstorage clear)
    localStorage.removeItem('cart');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, role, isLoggedIn, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
