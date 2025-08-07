// /components/Product/ProductSidebar.tsx

/**
 * ProductSidebar
 * Renders the filter drawer toggle and price sorting dropdown.
 * Also fetches categories from the backend.
 */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/components/store/store/store';
import {
  toggleCategory,
  setSortOrder,
} from '@/components/Product/productSlice';
import CategoryFilterDrawer from '@/components/filters/CategoryFilterDrawer';
import { Filter } from 'lucide-react';


type Category = {
  id: number;
  name: string;
};

export default function ProductSidebar() {
  const dispatch = useDispatch();

  const selectedCategories = useSelector(
    (state: RootState) => state.product.selectedCategories
  );
  const sortOrder = useSelector((state: RootState) => state.product.sortOrder);

  const [categories, setCategories] = useState<Category[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/`
        );
        setCategories(res.data.results || res.data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle sort option change
  const handleSortChange = (value: string) => {
    const mapped = value === 'price_asc' ? 'asc' : 'desc';
    dispatch(setSortOrder(mapped));
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
      {/* Filter Toggle */}
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-green-800">Filters</h2>
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 shadow focus:outline-none focus:ring-2 focus:ring-green-600 transition"
        >
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </button>
      </div>

      {/* Sort Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <label htmlFor="sort" className="text-sm font-medium text-green-800">
          Sort by:
        </label>
        <select
          id="sort"
          value={sortOrder === 'asc' ? 'price_asc' : 'price_desc'}
          onChange={(e) => handleSortChange(e.target.value)}
          className="border border-green-700 rounded px-3 py-2 text-green-800 focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
        </select>
      </div>

      {/* Filter Drawer */}
      <CategoryFilterDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        categories={categories}
        loading={loading}
        selectedCategoryIds={selectedCategories}
        onChange={(id) => dispatch(toggleCategory(id))}
      />
    </div>
  );
}
