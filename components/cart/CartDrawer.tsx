import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import DeleteCartItemButton from '@/components/common/DeleteCartItemButton';
import PlaceOrderButton from '@/components/common/PlaceOrderButton';

interface Product {
  id: number;
  name: string;
  price: string;
  image?: string;
}

interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export default function CartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const drawerRef = useRef<HTMLDivElement>(null);

  const fetchCart = async () => {
    const token = localStorage.getItem('access');
    if (!token) return;

    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/items/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data);
    } catch (err) {
      console.error('Cart error:', err);
    }
  };

  const updateQuantity = async (id: number, quantity: number) => {
    const token = localStorage.getItem('access');
    if (!token) return;

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/items/${id}/`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) {
      console.error('Update quantity failed:', err);
    }
  };

  useEffect(() => {
    if (isOpen) fetchCart();

    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const total = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            ref={drawerRef}
            className="fixed right-0 top-0 h-full w-[90%] sm:w-[400px] bg-white z-50 p-4 shadow-lg overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <h2 className="text-xl font-bold mb-4 text-green-800">🛒 Your Cart</h2>

            {cartItems.length === 0 ? (
              <p className="text-green-600">Your cart is empty.</p>
            ) : (
              cartItems.map((item) => {
                const { product, quantity } = item;
                const imageUrl = product.image?.startsWith('http')
                  ? product.image
                  : `${process.env.NEXT_PUBLIC_API_BASE_URL}${product.image}`
                const subtotal = parseFloat(product.price) * quantity;

                return (
                  <div
                    key={item.id}
                    className="mb-4 border-b pb-4 flex gap-3 items-start"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-green-900">{product.name}</p>
                      <p className="text-green-700">Ksh {product.price}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          className="px-2 bg-green-100 rounded hover:bg-green-200"
                          disabled={quantity <= 1}
                          onClick={() => updateQuantity(item.id, quantity - 1)}
                        >
                          −
                        </button>
                        <span>{quantity}</span>
                        <button
                          className="px-2 bg-green-100 rounded hover:bg-green-200"
                          onClick={() => updateQuantity(item.id, quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm font-bold mt-1">Subtotal: Ksh {subtotal.toFixed(2)}</p>
                    </div>
                    <DeleteCartItemButton itemId={item.id} onSuccess={fetchCart} />
                  </div>
                );
              })
            )}

            {/* Total + CTA */}
            <div className="border-t pt-4 mt-4 text-right">
              <p className="font-bold text-lg text-green-800">Total: Ksh {total.toFixed(2)}</p>
              <div className="mt-4">
                <PlaceOrderButton />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
