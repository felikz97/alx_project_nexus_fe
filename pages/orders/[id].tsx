import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  price: string;
  image?: string;
}

interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
}

interface OrderDetail {
  id: number;
  created_at: string;
  total_price: string;
  status: string;
  items: OrderItem[];
}

export default function OrderDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      const token = localStorage.getItem('access');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, router]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!order) return <p className="p-6 text-red-600">Order not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => window.history.back()}
        className="text-green-800 hover:bg-yellow-200 mb-2 bg-yellow-100"
      >
        ← Move Back
      </button>
      <h1 className="text-2xl font-bold text-green-800 mb-4">Order #{order.id}</h1>
      <p className="text-green-700 mb-2">
        Placed: {new Date(order.created_at).toLocaleString()}
      </p>
      <p className="text-green-600 mb-4">Status: {order.status}</p>

      <div className="space-y-4 mb-6">
        {order.items.map((item) => {
          const imageUrl = item.product.image?.startsWith('http')
            ? item.product.image
            : `${process.env.NEXT_PUBLIC_API_BASE_URL}${item.product.image}`;
          return (
            <div
              key={item.id}
              className="flex gap-4 items-center bg-white p-4 shadow rounded"
            >
              <div className="w-20 h-20 relative">
                {item.product.image ? (
                  <Image
                    src={imageUrl}
                    alt={item.product.name}
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
              <div>
                <p className="font-semibold text-green-800">{item.product.name}</p>
                <p className="text-green-600">Qty: {item.quantity}</p>
                <p className="text-green-700">
                  Ksh {(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-right font-bold text-xl text-green-900">
        Total: Ksh {order.total_price}
      </div>
    </div>
  );
}
