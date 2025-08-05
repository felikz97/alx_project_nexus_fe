// pages/products.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import CategoryFilterDrawer from "@/components/filters/CategoryFilterDrawer";
import Link from 'next/link';
import { useRouter } from 'next/router';
/**
 * ProductSearchPage Component
 *
 * Displays a list of products and allows searching by name or description.
 * - Loads all products initially.
 * - Filters products based on user input.
 * - Displays loading state and handles empty results.
 */
interface Category {
  id: number;
  name: string;
}

export default function ProductSearchPage() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch all products and categories initially
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  //  Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/categories");
      setCategories(response.data.results || response.data);
    } catch (error) {
      console.error("Category fetch error:", error);
    }
  };

  //  Fetch products, optionally filtered
  const fetchProducts = async (searchTerm = "", categoryIds: number[] = []) => {
    setLoading(true);
    try {
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (categoryIds.length > 0) params.category = categoryIds;

      const response = await axios.get("http://localhost:8000/api/products", { params });

      setProducts(response.data.results || response.data);
    } catch (error: any) {
      console.error("Fetch error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  //  Handle category change in drawer
  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  //  Apply filter when drawer closes
  const applyFilters = () => {
    fetchProducts(search, selectedCategoryIds);
    setIsFilterOpen(false);
  };

  //  Search handler
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchProducts(search, selectedCategoryIds);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Search + Filter */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products by name or description..."
          className="border border-gray-300 px-4 py-2 rounded w-64 focus:outline-none focus:ring focus:border-blue-400"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
          >
            Filter
          </button>
        </div>
      </form>

      {/* Drawer Component */}
      <CategoryFilterDrawer
        isOpen={isFilterOpen}
        onClose={applyFilters}
        categories={categories}
        selectedCategoryIds={selectedCategoryIds}
        onChange={handleCategoryChange}
      />

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border p-4 rounded shadow space-y-3">
              <div className="h-40 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-8 bg-gray-200 rounded w-24" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">No products found. Try a different search or filter.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <div key={product.id} className="border p-4 rounded shadow bg-white flex flex-col">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded mb-3"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 mb-3 rounded">
                  No image
                </div>
              )}
              <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
              <p className="text-gray-600 text-sm flex-grow">{product.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-green-600 font-bold text-md">Ksh{product.price}</span>
                
                <Link href={`/products/${product.id}`}>
                <a className="bg-green-300 text-green-800 text-sm px-3 py-1 rounded hover:bg-green-700">
                  View
                </a>
              </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

