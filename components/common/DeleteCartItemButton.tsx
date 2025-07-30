// components/common/DeleteCartItemButton.tsx

import axios from 'axios';

interface Props {
  itemId: number;
  onSuccess?: () => void; // ✅ Add this
}

export default function DeleteCartItemButton({ itemId, onSuccess }: Props) {
  const handleDelete = async () => {
    const token = localStorage.getItem('access');
    if (!token) return;

    try {
      await axios.delete(`http://localhost:8000/api/cart/items/${itemId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ Trigger callback if provided
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(' Failed to delete item:', error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:text-red-800 font-medium text-sm"
    >
       Remove
    </button>
  );
}
