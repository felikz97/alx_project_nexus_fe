import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/components/store/store/store';

import ProductSidebar from '@/components/Product/ProductSidebar';
import ProductCard from '@/components/Product/ProductCard';
import Spinner from './common/spinner';

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

  // Fetch products when category or search changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        if (searchTerm) params.append('search', searchTerm);
        selectedCategories.forEach(id => params.append('category', id.toString()));

        const res = await axios.get(`http://localhost:8000/api/products/?${params.toString()}`);
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
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      {/* Sidebar (mobile collapsible inside ProductSidebar) */}
      <ProductSidebar />

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center items-center">
            <Spinner />
          </div>
        ) : products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="col-span-full text-green-700 text-center">No products found.</p>
        )}
      </div>
    </div>
  );
}
