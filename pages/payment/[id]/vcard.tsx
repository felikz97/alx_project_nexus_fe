import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface OrderItem {
  quantity: number;
}

interface Order {
  id: number;
  total_price: string;
  items: OrderItem[];
}

export default function CardPayment() {
  const { id } = useRouter().query;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      const token = localStorage.getItem('access');
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/orders/${id}/`, {
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
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(' Payment submitted (simulated). You can now mark this order as paid.');
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!order) return <p className="p-6 text-red-600">Order not found.</p>;

  const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <button
        onClick={() => window.history.back()}
        className="text-green-800 hover:bg-yellow-200 mb-2 bg-yellow-100"
      >
        ← Move Back
      </button>

      <h1 className="text-2xl font-bold text-gray-800">Visa / MasterCard Payment</h1>

      <div className="text-gray-700">
        <p>🧾 <strong>Order:</strong> #{order.id}</p>
        <p>📦 <strong>Items:</strong> {itemCount}</p>
        <p>💰 <strong>Total:</strong> Ksh {order.total_price}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 mt-4">
        <input
          type="text"
          placeholder="Card number"
          className="w-full px-4 py-2 border border-gray-300 rounded"
          required
        />
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="MM/YY"
            className="w-1/2 px-4 py-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            placeholder="CVV"
            className="w-1/2 px-4 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <input
          type="text"
          placeholder="Name on card"
          className="w-full px-4 py-2 border border-gray-300 rounded"
          required
        />

        <button
          type="submit"
          className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900"
        >
          Pay Ksh {order.total_price}
        </button>
      </form>

      {message && <p className="text-sm text-green-700 mt-2">{message}</p>}
    </div>
  );
}
