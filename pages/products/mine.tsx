import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/utils/axiosInstance';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: string;
  image?: string;
  stock: number;
  category?: { name: string };
}

export default function MyCatalogsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchMyProducts = async () => {
      try {
        const res = await api.get('/api/products/mine/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data.results || res.data);
      } catch (err) {
        console.error('❌ Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProducts();
  }, [router]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-green-800 mb-4">📦 My Product Catalogs</h1>

      {loading && <p className="text-green-600">Loading...</p>}

      {!loading && products.length === 0 && (
        <p className="text-green-700">You haven’t created any products yet.</p>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {products.map(product => {
          const imageUrl = product.image?.startsWith('http')
            ? product.image
            : `http://localhost:8000${product.image}`;

          return (
            <div key={product.id} className="bg-white p-4 shadow rounded border">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden">
                  {product.image ? (
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center text-sm text-gray-400 h-full">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-green-800">{product.name}</h2>
                  <p className="text-green-700 text-sm">Ksh {product.price}</p>
                  <p className="text-gray-500 text-xs">Stock: {product.stock}</p>
                  <p className="text-gray-500 text-xs">Category: {product.category?.name}</p>
                  <Link
                    href={`/products/${product.id}/edit`}
                    className="inline-block mt-2 text-sm text-white bg-yellow-600 px-3 py-1 rounded hover:bg-yellow-700"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
