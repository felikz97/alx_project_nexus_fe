import { useEffect, useState } from 'react';

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access');
    setIsAuthenticated(!!token);
  }, []);

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setIsAuthenticated(false);
    window.location.href = '/login'; // redirect
  };

  return { isAuthenticated, logout };
}
