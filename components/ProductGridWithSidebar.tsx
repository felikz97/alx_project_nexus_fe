import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/components/store/store/store';

import ProductSidebar from '@/components/Product/ProductSidebar';
import ProductCard from '@/components/Product/ProductCard';

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  image?: string;
  
};

export default function ProductGridWithSidebar() {
  const { selectedCategories, searchTerm } = useSelector((state: RootState) => state.product);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Build query and fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        selectedCategories.forEach(id => params.append('category', id.toString()));

        const res = await axios.get(`http://localhost:8000/api/products/?${params}`);
        setProducts(res.data.results || res.data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategories, searchTerm]);

return (
  <div className="flex flex-col gap-6 p-6">
    {/* Sidebar on top */}
    <ProductSidebar />

    {/* Product Grid below */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {loading ? (
        <p className="text-green-700">Loading...</p>
      ) : products.length ? (
        products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <p className="text-green-700">No products found.</p>
      )}
    </div>
  </div>
);
}
