import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Image from 'next/image';

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

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch cart items
useEffect(() => {
  const fetchCart = async () => {
    const token = localStorage.getItem('access');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await axios.get('http://localhost:8000/api/cart/items/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data);
    } catch (err) {
      console.error('Cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchCart();
}, []);

  const total = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-green-800 mb-4">🛒 Your Cart</h1>

      {loading ? (
        <p className="text-green-600">Loading...</p>
      ) : cartItems.length === 0 ? (
        <p className="text-green-700">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map(item => {
              const imageUrl = item.product.image?.startsWith('http')
                ? item.product.image
                : `http://localhost:8000${item.product.image}`;
              return (
                <div key={item.id} className="flex gap-4 bg-white p-4 shadow rounded-md">
                  <div className="w-24 h-24 relative">
                    <Image
                      src={imageUrl}
                      alt={item.product.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded"
                    />
                  </div>
                  <div className="flex flex-col justify-between">
                    <p className="font-semibold text-green-800">{item.product.name}</p>
                    <p className="text-green-700">Qty: {item.quantity}</p>
                    <p className="text-green-900 font-bold">
                      ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-right font-bold text-xl text-green-900 mt-6">
            Total: ${total.toFixed(2)}
          </div>
        </>
      )}
    </div>
  );
}
