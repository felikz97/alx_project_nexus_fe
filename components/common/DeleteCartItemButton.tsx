// components/common/DeleteCartItemButton.tsx

import axios from 'axios';

interface Props {
  itemId: number;
  onSuccess?: () => void; //  Add this
}

export default function DeleteCartItemButton({ itemId, onSuccess }: Props) {
  const handleDelete = async () => {
    const token = localStorage.getItem('access');
    if (!token) return;

    try {
      //  Make the DELETE request to the API
      await axios.delete(`http://localhost:8000/api/cart/items/${itemId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      //  Trigger callback if provided
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(' Failed to delete item:', error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 bg-yellow-400  font-medium text-sm hover:bg-red-500 hover:text-green-400 px-2 py-1 rounded"
    >
      Remove
    </button>
  );
}
