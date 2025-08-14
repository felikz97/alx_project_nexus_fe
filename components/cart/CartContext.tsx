// components/cart/CartContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

interface CartItem {
  id: number;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  updateCart: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  //  Safe API URL fallback
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || window.location.origin;

  const fetchCart = async () => {
    const token = localStorage.getItem('access');

    if (!token) {
      setCartItems([]);
      return;
    }

    try {
      const url = `${API_BASE}/api/cart/items/`;
      console.log('Fetching cart from:', url);

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems(res.data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setCartItems([]);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  return (
    <CartContext.Provider value={{ cartItems, cartCount, updateCart: fetchCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
