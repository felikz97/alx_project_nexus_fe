// list all products for admin to manage them
// pages/admin/products/index.tsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '@/components/admin/AdminLayout';
import Spinner from '@/components/common/spinner';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import Link from 'next/link';

type Product = {
  id: number;
  name: string;
  price: number;
  category: {
    id: number;
    name: string;
  };
  is_active: boolean;
  created_at: string;
};

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { authorized, loading: authLoading } = useAdminAuth();

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  /**
   * Fetch all products from the API, using secure token-based headers.
   */
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/products/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data.results || response.data;
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authorized) fetchProducts();
  }, [authorized]);

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
      <h1 className="text-2xl font-bold mb-6">All Products</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white text-sm sm:text-base">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Price</th>
              <th className="p-3 border">Category</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Created</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="p-3 border">{product.id}</td>
                <td className="p-3 border">{product.name}</td>
                <td className="p-3 border">${product.price.toFixed(2)}</td>
                <td className="p-3 border">
                  {product.category?.name || 'Uncategorized'}
                </td>
                <td className="p-3 border">
                  {product.is_active ? (
                    <span className="text-green-600 font-medium">Active</span>
                  ) : (
                    <span className="text-red-600 font-medium">Inactive</span>
                  )}
                </td>
                <td className="p-3 border">
                  {new Date(product.created_at).toLocaleDateString()}
                </td>
                <td className="p-3 border">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
