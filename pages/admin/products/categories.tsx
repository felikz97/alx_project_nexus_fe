// Allow admin to add and manage all categories of products
// pages/admin/products/categories.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '@/components/admin/AdminLayout';
import Spinner from '@/components/common/spinner';
import { useAdminAuth } from '@/hooks/useAdminAuth';

type Category = {
  id: number;
  name: string;
};

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { authorized, loading: authLoading } = useAdminAuth();

  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  /**
   * Fetch categories from the backend.
   */
  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/categories/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(res.data);
    } catch (err) {
      setError('Failed to fetch categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authorized) fetchCategories();
  }, [authorized]);

  /**
   * Add a new product category.
   */
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await axios.post(
        'http://localhost:8000/api/categories/',
        { name: newCategory },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewCategory('');
      fetchCategories();
    } catch (err) {
      setError('Failed to add category.');
    }
  };

  /**
   * Delete an existing category by ID.
   */
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/categories/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchCategories();
    } catch (err) {
      setError('Failed to delete category.');
    }
  };

  // Show loading spinner during auth or data fetching
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
      <h2 className="text-2xl font-bold mb-4">Product Categories</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <input
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded w-full sm:w-1/2"
          placeholder="New category name"
        />
        <button
          onClick={handleAddCategory}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
        >
          Add Category
        </button>
      </div>

      <ul className="space-y-2">
        {categories.map(cat => (
          <li
            key={cat.id}
            className="flex justify-between items-center bg-white p-3 border rounded shadow-sm"
          >
            <span className="text-gray-800">{cat.name}</span>
            <button
              onClick={() => handleDelete(cat.id)}
              className="text-red-600 hover:underline text-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </AdminLayout>
  );
}
