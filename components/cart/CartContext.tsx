// components/cart/CartContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';

interface CartItem {
  id: number;
  quantity: number;
  // optionally product details
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  updateCart: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const fetchCart = async () => {
    const token = localStorage.getItem('access');
    if (!token) return;

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/items/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(res.data);
    } catch (err) {
      console.error(' Failed to fetch cart:', err);
    }
  };

  const clearCart = () => {
    setCartItems([]); // instantly clear in UI
  };

  useEffect(() => {
    fetchCart();
  }, []);

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
