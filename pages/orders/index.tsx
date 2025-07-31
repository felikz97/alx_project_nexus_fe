import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Order {
  id: number;
  created_at: string;
  total_price: string;
  status: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('access');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/api/orders/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const orderResults = response.data.results;
        if (!Array.isArray(orderResults)) {
          throw new Error('Unexpected response format from server');
        }

        setOrders(orderResults);
      } catch (err: any) {
        console.error('❌ Full error response:', err.response || err.message || err);
        if (err.response?.status === 401) {
          setError('Unauthorized. Please login again.');
          localStorage.removeItem('access');
          router.push('/login');
        } else {
          setError('Failed to load orders. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-green-800 mb-6">📦 Your Orders</h1>

      {loading && <p className="text-green-600">Loading orders...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && orders.length === 0 && (
        <p className="text-green-700">You have no orders yet.</p>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-4 bg-white shadow rounded flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-green-900">Order #{order.id}</p>
                <p className="text-green-700 text-sm">
                  Placed: {new Date(order.created_at).toLocaleString()}
                </p>
                <p className="text-green-600 text-sm">Status: {order.status}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-800">Ksh {order.total_price}</p>
                <Link
                  href={`/orders/${order.id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
