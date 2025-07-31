import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';

interface CartContextType {
  cartCount: number;
  updateCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    const token = localStorage.getItem('access');
    if (!token) return;

    try {
      const res = await axios.get('http://localhost:8000/api/cart/items/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const totalQuantity = res.data.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      );
      setCartCount(totalQuantity);
    } catch (err) {
      console.error('🔴 Failed to fetch cart count:', err);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, updateCart: fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
