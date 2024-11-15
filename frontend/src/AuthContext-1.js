import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const userInfo = JSON.parse(atob(storedToken.split('.')[1]));
        setToken(storedToken);
        setIsAuthenticated(true);
        setUserRole(userInfo.isAdmin ? "admin" : "customer");
      } catch (error) {
        console.error("Failed to parse token:", error);
        // Token is invalid or malformed, clear it
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUserRole(null);
      }
    }
  }, []);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    try {
      const userInfo = JSON.parse(atob(newToken.split('.')[1]));
      setToken(newToken);
      setIsAuthenticated(true);
      setUserRole(userInfo.isAdmin ? "admin" : "customer");
    } catch (error) {
      console.error("Failed to parse token during login:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
