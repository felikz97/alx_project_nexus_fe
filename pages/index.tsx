import { useEffect, useState } from 'react';
import axios from 'axios';

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/products/')
      .then(res => setProducts(res.data.results || res.data))
      .catch(err => console.error('Product fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="text-green-900 bg-yellow-50 min-h-screen">
      {/* Hero Section */}
      <section
        className="relative bg-green-900 text-yellow-50 min-h-[70vh] flex flex-col justify-center items-center text-center px-6"
        style={{
          backgroundImage: 'url("/assets/hero-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-black/50 p-10 rounded-lg max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">Welcome to E-Shop</h1>
          <p className="text-yellow-100 mb-2">
            Discover our latest products and enjoy seamless online shopping.
          </p>
        </div>
      </section>

      {/* Product List */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-6">🛍 Featured Products</h2>

        {loading ? (
          <p className="text-green-700">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-white shadow p-4 rounded-md border-l-4 border-green-600">
                <h3 className="text-xl font-semibold text-green-800">{product.name}</h3>
                <p className="text-green-700 text-sm mb-2">{product.description}</p>
                <p className="text-green-900 font-bold">${product.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
