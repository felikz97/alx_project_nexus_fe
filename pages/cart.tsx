// pages/cart.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

import DeleteCartItemButton from '@/components/common/DeleteCartItemButton';
import PlaceOrderButton from '@/components/common/PlaceOrderButton';
import { useCart } from '@/components/cart/CartContext';

export default function CartPage() {
  const router = useRouter();
  const { cartItems, updateCart } = useCart();
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    setLoading(true);
    await updateCart();
    setLoading(false);
  };

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    const token = localStorage.getItem('access');
    if (!token) return;
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/items/${itemId}/`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      updateCart(); // instantly refresh
    } catch (err) {
      console.error('Failed to update quantity', err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      alert(' Please log in to view your cart.');
      router.push('/login');
    } else {
      fetchCart();
    }
  }, [router]);

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartItems.reduce(
    (sum, item: any) => sum + parseFloat(item.product.price) * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <button
        onClick={() => window.history.back()}
        className="text-green-800 hover:bg-yellow-200 mb-2 bg-yellow-100"
      >
        ← Move Back
      </button>
      <h1 className="text-2xl font-bold text-green-800 mb-6">🛒 Your Cart</h1>

      {loading ? (
        <p className="text-green-600">Loading...</p>
      ) : cartItems.length === 0 ? (
        <p className="text-green-700">Your cart is empty.</p>
      ) : (
        <>
          <AnimatePresence>
            {cartItems.map((item: any) => {
              const { product, quantity } = item;
              const imageUrl = product.image?.startsWith('http')
                ? product.image
                : `${process.env.NEXT_PUBLIC_API_BASE_URL}${product.image}`;
              const itemTotal = parseFloat(product.price) * quantity;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col sm:flex-row gap-4 bg-white p-4 shadow rounded-md"
                >
                  <div className="w-full sm:w-24 h-48 sm:h-24 relative flex-shrink-0">
                    {product.image ? (
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between w-full">
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-green-800">{product.name}</p>
                      <p className="text-green-700">
                        Price: Ksh {parseFloat(product.price).toFixed(2)}
                      </p>
                      <p className="text-green-900 font-bold">
                        Subtotal: Ksh {itemTotal.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50"
                      >
                        −
                      </button>
                      <span className="font-semibold">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                      >
                        +
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                      <DeleteCartItemButton itemId={item.id} onSuccess={updateCart} />
                      <PlaceOrderButton />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          <div className="mt-10 text-green-900">
            <div className="text-right font-bold text-xl">
              <p className="text-green-700 font-medium">Total Items: {totalQuantity}</p>
              Total: Ksh {total.toFixed(2)}
            </div>

            <div className="mt-4 flex justify-end">
              <PlaceOrderButton />
            </div>

            <p className="text-sm text-gray-500 mt-4 text-right">
              Note: Prices are subject to change based on availability.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
