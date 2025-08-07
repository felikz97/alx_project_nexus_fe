// Allow admin to add and manage all categories of products
// pages/admin/products/categories.tsx
// pages/admin/products/categories.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '@/components/admin/AdminLayout';
import Spinner from '@/components/common/spinner';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import toast from 'react-hot-toast';

type Category = {
  id: number;
  name: string;
};

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState('');
  const [loading, setLoading] = useState(true);
  const { authorized, loading: authLoading } = useAdminAuth();

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = res.data;
      const categoriesData = Array.isArray(data)
        ? data
        : data.results || [];
      setCategories(categoriesData);
    } catch (err: any) {
      toast.error('Failed to fetch categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authorized) fetchCategories();
  }, [authorized]);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/`,
        { name: newCategory },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Category added.');
      setNewCategory('');
      fetchCategories();
    } catch (err: any) {
      const detail =
        err.response?.data?.detail || 'Failed to add category.';
      toast.error(detail);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this category?'
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/${id}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Category deleted.');
      fetchCategories();
    } catch (err: any) {
      toast.error('Failed to delete category.');
    }
  };

  const handleSaveEdit = async (id: number) => {
    if (!editedName.trim()) return;

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/${id}/`,
        { name: editedName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Category updated.');
      setEditingId(null);
      setEditedName('');
      fetchCategories();
    } catch (err) {
      toast.error('Failed to update category.');
    }
  };

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
      <h2 className="text-2xl font-bold mb-6">Manage Product Categories</h2>

      {/* Add Category */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded w-full sm:w-1/2"
          placeholder="Enter new category name"
        />
        <button
          onClick={handleAddCategory}
          disabled={!newCategory.trim()}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition disabled:opacity-50"
        >
          Add Category
        </button>
      </div>

      {/* Category List */}
      <ul className="space-y-2">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="flex justify-between items-center bg-white p-3 border rounded shadow-sm"
          >
            <div className="flex-grow">
              {editingId === cat.id ? (
                <input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="border px-2 py-1 rounded w-full sm:w-1/2"
                />
              ) : (
                <span className="text-gray-800">{cat.name}</span>
              )}
            </div>
            <div className="space-x-2 flex-shrink-0">
              {editingId === cat.id ? (
                <>
                  <button
                    onClick={() => handleSaveEdit(cat.id)}
                    className="text-green-600 hover:underline text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-gray-500 hover:underline text-sm"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditingId(cat.id);
                      setEditedName(cat.name);
                    }}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </AdminLayout>
  );
}
