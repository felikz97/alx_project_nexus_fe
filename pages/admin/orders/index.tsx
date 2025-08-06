// list all orders for all users to admin
// pages/admin/orders/index.tsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import Spinner from '@/components/common/spinner';

type Order = {
  id: number;
  customer_name: string;
  status: string;
  total_price: number;
  created_at: string;
};

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { authorized, loading: authLoading } = useAdminAuth();

  /**
   * Fetch all orders from the backend when component mounts.
   */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get('http://localhost:8000/api/orders/', {
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
  }, []);

  /**
   * Show spinner during auth or data load.
   */
  if (authLoading || loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      </AdminLayout>
    );
  }

  /**
   * Return nothing if unauthorized. useAdminAuth handles redirect.
   */
  if (!authorized) return null;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white rounded shadow">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border">Order ID</th>
              <th className="p-3 border">Customer</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Total</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-3 border">{order.id}</td>
                <td className="p-3 border">{order.customer_name}</td>
                <td className="p-3 border capitalize">{order.status}</td>
                <td className="p-3 border">${order.total_price.toFixed(2)}</td>
                <td className="p-3 border">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="p-3 border">
                  <Link
                    href={`/admin/orders/${order.status}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View by status
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
