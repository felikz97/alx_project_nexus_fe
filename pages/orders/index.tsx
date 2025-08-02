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

// Tabs shown in the UI
const STATUS_TABS = ['unpaid', 'paid', 'on transit', 'completed', 'cancelled'];

// Mapping of tab → actual backend status
const STATUS_MAP: Record<string, string> = {
  unpaid: 'pending',
  paid: 'paid',
  on_transit: 'shipped',
  completed: 'completed',
  cancelled: 'cancelled',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<string>('unpaid');
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
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  // Normalize and filter based on backend status
  const filteredOrders = orders.filter(
    (order) => order.status === STATUS_MAP[activeStatus]
  );

  const statusCounts = Object.entries(STATUS_MAP).reduce((acc, [tabKey, backendStatus]) => {
  acc[tabKey] = orders.filter((order) => order.status === backendStatus).length;
  return acc;
  }, {} as Record<string, number>);
  return (
    <div className="max-w-5xl mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="text-blue-600 hover:underline mb-2"
      >
        ← Move Back
      </button>
      <h1 className="text-2xl font-bold text-green-800 mb-4">📦 Your Orders</h1>

      <div className="flex gap-4 mb-6">
        {STATUS_TABS.map((status) => (
          <button
            key={status}
            onClick={() => setActiveStatus(status)}
            className={`px-4 py-2 rounded flex items-center gap-1 ${
              activeStatus === status
                ? 'bg-green-700 text-white'
                : 'bg-green-100 text-green-700'
            }`}
          >
            <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
            <span className="bg-white text-green-700 rounded-full text-xs px-2">
              {statusCounts[status.replace(' ', '_')] || 0}
            </span>
          </button>
        ))}
      </div>

      {loading && <p className="text-green-600">Loading orders...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && filteredOrders.length === 0 && (
        <p className="text-green-700">No {activeStatus} orders.</p>
      )}

      {!loading && !error && filteredOrders.length > 0 && (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-4 bg-white shadow rounded flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-green-900">Order #{order.id}</p>
                <p className="text-green-700 text-sm">
                  Placed: {new Date(order.created_at).toLocaleString()}
                </p>
                <p className="text-green-600 text-sm capitalize">
                  Status: {order.status}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-800">Ksh {order.total_price}</p>
                <Link
                  href={`/orders/${order.id}`}
                  className="text-sm text-blue-600 hover:underline block"
                >
                  View Details →
                </Link>
                {order.status === 'pending' && (
                  <div className="mt-1 flex gap-2 justify-end">
                    <Link
                      href={`/payment/${order.id}`}
                      className="text-sm text-white bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                    >
                      Make Payment
                    </Link>
                    <button
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem('access');
                          await axios.patch(
                            `http://localhost:8000/api/orders/orders/${order.id}/`,
                            { status: 'cancelled' },
                            {
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            }
                          );
                          setOrders((prev) =>
                            prev.map((o) =>
                              o.id === order.id ? { ...o, status: 'cancelled' } : o
                            )
                          );
                        } catch (err) {
                          alert('Failed to cancel order.');
                        }
                      }}
                      className="text-sm text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                    >
                      Cancel Order
                    </button>
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
