import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Image from 'next/image';
import DeleteCartItemButton from '@/components/common/DeleteCartItemButton';

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

  const fetchCart = async () => {
    const token = localStorage.getItem('access');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await axios.get('http://localhost:8000/api/cart/items/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(res.data);
    } catch (err) {
      console.error('Cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [router]);

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartItems.reduce((sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-green-800 mb-6">🛒 Your Cart</h1>

      {loading ? (
        <p className="text-green-600">Loading...</p>
      ) : cartItems.length === 0 ? (
        <p className="text-green-700">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => {
              const { product, quantity } = item;
              const imageUrl = product.image?.startsWith('http')
                ? product.image
                : `http://localhost:8000${product.image}`;

              const itemTotal = parseFloat(product.price) * quantity;

              return (
                <div
                  key={item.id}
                  className="flex gap-4 bg-white p-4 shadow rounded-md items-center"
                >
                  <div className="w-24 h-24 relative">
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

                  <div className="flex-1 flex flex-col justify-between">
                    <p className="font-semibold text-green-800">{product.name}</p>
                    <p className="text-green-700">Quantity: {quantity}</p>
                    <p className="text-green-600">Price: Ksh {parseFloat(product.price).toFixed(2)}</p>
                    <p className="text-green-900 font-bold">
                      Subtotal: Ksh {itemTotal.toFixed(2)}
                    </p>
                  </div>

                  <DeleteCartItemButton itemId={item.id} onSuccess={fetchCart} />
                </div>
              );
            })}
          </div>

          <div className="text-right font-bold text-xl text-green-900 mt-8">
            <p className="text-green-700 font-medium">Total Items: {totalQuantity}</p>
            Total: Ksh {total.toFixed(2)}
          </div>
        </>
      )}
    </div>
  );
}
