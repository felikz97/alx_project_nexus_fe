import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import axios from 'axios';
import Link from 'next/link';

// Allow TypeScript to recognize PayPal SDK on window
declare global {
  interface Window {
    paypal: any;
  }
}

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
  const [sdkReady, setSdkReady] = useState(false);

  // Fetch order details
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
        console.error('❌ Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // Render PayPal button after SDK and order are ready
  useEffect(() => {
    if (!order || !sdkReady || !window.paypal) return;

    const container = document.getElementById('paypal-button');
    if (!container) return;

    container.innerHTML = ''; // Clear existing render

    window.paypal.Buttons({
      createOrder: (_data: any, actions: any) => {
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
      onApprove: (_data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          alert(`✅ Payment completed by ${details.payer.name.given_name}`);
          console.log('✅ Payment details:', details);
        });
      },
      onError: (err: any) => {
        console.error('❌ PayPal error:', err);
      },
    }).render('#paypal-button');
  }, [order, sdkReady]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!order) return <p className="p-6 text-red-600">Order not found.</p>;

  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <button
        onClick={() => window.history.back()}
        className="text-blue-600 hover:underline mb-2"
      >
        ← Back to Payment Methods
      </button>
      <h1 className="text-2xl font-bold text-blue-700">PayPal Payment</h1>

      <div className="text-blue-900">
        <p>🧾 <strong>Order:</strong> #{order.id}</p>
        <p>📦 <strong>Items:</strong> {itemCount}</p>
        <p>💰 <strong>Total:</strong> ${order.total_price}</p>
      </div>

      <div id="paypal-button" className="mt-4" />

      <Script
        src={`https://www.paypal.com/sdk/js?client-id=Ad77Gp3-O87gNMm7ZC0eTDPrWxK3JIgafFcAZhP79GpEKseJqlPQRBbwNnRUj1EktQ3doFMDe7qGPHsI`}
        strategy="afterInteractive"
        onLoad={() => setSdkReady(true)}
      />
    </div>
  );
}
