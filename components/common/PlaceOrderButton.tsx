// components/common/PlaceOrderButton.tsx
import axios from 'axios';
import { useRouter } from 'next/router';
import { useCart } from '../cart/CartContext';

export default function PlaceOrderButton() {
  const router = useRouter();
  const { updateCart, clearCart } = useCart(); // new function in context

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem('access');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/place/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        alert(' Order placed successfully!');
        clearCart(); // instantly set cart count to 0 & empty cart
        router.push('/orders'); // or confirmation page
      } else {
        alert('⚠ Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Place order error:', error);
      alert(' Failed to place order. Please try later.');
    }
  };

  return (
    <button
      onClick={handlePlaceOrder}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-6"
    >
      🧾 Place Order
    </button>
  );
}
