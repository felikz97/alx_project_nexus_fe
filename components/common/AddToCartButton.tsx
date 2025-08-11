// components/common/AddToCartButton.tsx
import axios from 'axios';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useCart } from '../cart/CartContext';
interface AddToCartButtonProps {
  productId: number;
}

export default function AddToCartButton({ productId }: AddToCartButtonProps) {
  const router = useRouter();
  const { updateCart } = useCart(); 

  const handleAddToCart = useCallback(async () => {
    const token = localStorage.getItem('access');

    if (!token) {
      alert(' You must be logged in to add items to the cart.');
      router.push('/login');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/items/add/`,
        { product_id: productId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        alert(' Product added to cart!');
        updateCart(); 
      } else {
        console.warn('Unexpected response:', response);
        alert(' Something went wrong. Please try again.');
      }
    } catch (error: any) {
      console.error('Add to cart error:', error);

      if (error.response?.status === 401) {
        alert(' You are not authorized. Please log in again.');
        router.push('/login');
      } else if (error.response?.status === 400) {
        alert(' Bad request. Please try again.');
      } else {
        alert('Failed to add to cart. Please try later.');
      }
    }
  }, [productId, router, updateCart]);

  return (
    <button
      onClick={handleAddToCart}
      className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded mt-4"
    >
      Add to Cart
    </button>
  );
}
