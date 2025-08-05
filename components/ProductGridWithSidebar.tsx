// /components/Product/ProductGridWithSidebar.tsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

import { RootState } from '@/components/store/store/store';
import ProductSidebar from '@/components/Product/ProductSidebar';
import ProductCard from '@/components/Product/ProductCard';
import Spinner from '@/components/common/spinner';

// Product type definition
type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  image?: string;
};

/**
 * ProductGridWithSidebar
 * Displays a sidebar for filtering and a responsive grid of products.
 */
export default function ProductGridWithSidebar() {
  // Access global filter state from Redux
  const { selectedCategories, searchTerm, sortOrder } = useSelector(
    (state: RootState) => state.product
  );

  // Local component state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Fetch products from API with filters applied.
   * Runs every time filters (category, search, sort) change.
   */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        // Apply search term filter
        if (searchTerm) {
          params.append('search', searchTerm);
        }

        // Apply category filters
        selectedCategories.forEach((id) =>
          params.append('category', id.toString())
        );

        // Apply sort order by price
        params.append('ordering', sortOrder === 'asc' ? 'price' : '-price');

        // API call
        const response = await axios.get(
          `http://localhost:8000/api/products/?${params.toString()}`
        );

        // Support pagination (`results`) or direct list
        setProducts(response.data.results || response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategories, searchTerm, sortOrder]);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      {/* Sidebar (Filter + Sort) */}
      <ProductSidebar />

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading ? (
          // Show spinner while loading
          <div className="col-span-full flex justify-center items-center">
            <Spinner />
          </div>
        ) : products.length > 0 ? (
          // Render product cards
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          // Show fallback if no products found
          <p className="col-span-full text-green-700 text-center">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
}
