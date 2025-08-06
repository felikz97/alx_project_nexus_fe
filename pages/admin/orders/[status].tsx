// orders by status
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import Spinner from '@/components/common/spinner';

type Order = {
  id: number;
  customer_name: string;
  status: string;
  total_price: number;
};

export default function OrdersByStatus() {
  const router = useRouter();
  const { status } = router.query;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { authorized, loading: authLoading } = useAdminAuth();

  useEffect(() => {
    console.log("Status param:", status);
    const fetchOrders = async () => {
      if (!status || Array.isArray(status)) return;

      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(`http://localhost:8000/api/orders/?status=${status}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data);
      } catch (err) {
        setError('Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [status]);

  if (authLoading || loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      </AdminLayout>
    );
  }

  if (!authorized) return null;

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4 capitalize">Orders: {status}</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found for this status.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3 text-left">Order ID</th>
                <th className="border p-3 text-left">Customer</th>
                <th className="border p-3 text-left">Status</th>
                <th className="border p-3 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="border p-3">{order.id}</td>
                  <td className="border p-3">{order.customer_name}</td>
                  <td className="border p-3 capitalize">{order.status}</td>
                  <td className="border p-3">Ksh {order.total_price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
