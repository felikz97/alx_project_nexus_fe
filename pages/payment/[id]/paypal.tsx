import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import axios from 'axios';

interface OrderItem {
  quantity: number;
}

interface Order {
  id: number;
  total_price: string;
  items: OrderItem[];
}

export default function PayPalPayment() {
  const { id } = useRouter().query;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      const token = localStorage.getItem('access');
      try {
        const res = await axios.get(`http://localhost:8000/api/orders/orders/${id}/`, {
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

  useEffect(() => {
    if (typeof window !== 'undefined' && window.paypal && order) {
      // @ts-ignore
      window.paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: order.total_price,
                  currency_code: 'USD',
                },
              },
            ],
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            console.log('✅ Payment approved:', details);
            alert('Payment completed by ' + details.payer.name.given_name);
          });
        },
        onError: (err: any) => {
          console.error('❌ PayPal error:', err);
        },
      }).render('#paypal-button');
      setReady(true);
    }
  }, [order]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!order) return <p className="p-6 text-red-600">Order not found.</p>;

  const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-blue-700">PayPal Payment</h1>

      <div className="text-blue-900">
        <p>🧾 <strong>Order:</strong> #{order.id}</p>
        <p>📦 <strong>Items:</strong> {itemCount}</p>
        <p>💰 <strong>Total:</strong> ${order.total_price}</p>
      </div>

      <div id="paypal-button" className="mt-4" />

      <Script
        src={`https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD`}
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
      />
    </div>
  );
}
