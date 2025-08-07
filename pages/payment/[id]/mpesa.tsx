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

export default function MPesaPayment() {
  const { id } = useRouter().query;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
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

  const handlePayment = async () => {
    if (!phone.match(/^07\d{8}$/)) {
      setMessage('Enter a valid Safaricom number (format: 07XXXXXXXX)');
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('access');

      // Placeholder: POST to your backend's M-Pesa payment endpoint
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/mpesa/stk/`,
        {
          order_id: order?.id,
          phone_number: phone,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(' Payment prompt sent. Complete it on your phone.');
    } catch (err: any) {
      setMessage(' Failed to initiate M-Pesa payment.');
    } finally {
      setSubmitting(false);
    }
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
      <h1 className="text-2xl font-bold text-green-700">M-Pesa Payment</h1>

      <div className="text-green-800">
        <p>🧾 <strong>Order:</strong> #{order.id}</p>
        <p>📦 <strong>Items:</strong> {itemCount}</p>
        <p>💰 <strong>Total:</strong> Ksh {order.total_price}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-green-900 mb-1">
          Enter M-Pesa phone number:
        </label>
        <input
          type="tel"
          placeholder="07XXXXXXXX"
          className="w-full px-4 py-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <button
        onClick={handlePayment}
        disabled={submitting}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded disabled:opacity-50"
      >
        {submitting ? 'Processing...' : 'Pay with M-Pesa'}
      </button>

      {message && <p className="text-sm text-green-800 mt-2">{message}</p>}
    </div>
  );
}
