// /components/Product/ProductSidebar.tsx

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

// Local Category type
type Category = {
  id: number;
  name: string;
};

/**
 * ProductSidebar
 * Renders the filter drawer toggle and price sorting dropdown.
 * Also fetches categories from the backend.
 */
export default function ProductSidebar() {
  // Local state for fetched categories and drawer visibility
  const [categories, setCategories] = useState<Category[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Redux state
  const selectedCategories = useSelector(
    (state: RootState) => state.product.selectedCategories
  );
  const sortOrder = useSelector((state: RootState) => state.product.sortOrder);
  const dispatch = useDispatch();

  /**
   * Fetch categories from the API when the component mounts.
   */
  useEffect(() => {
    axios
      .get('http://localhost:8000/api/categories/')
      .then(res => setCategories(res.data.results || res.data))
      .catch(err => console.error('Failed to load categories:', err))
  }, []);

  /**
   * Convert select dropdown values to correct sort order format
   * and dispatch to redux store.
   */
  const handleSortChange = (value: string) => {
    const mapped =
      value === 'price_asc' ? 'asc' : value === 'price_desc' ? 'desc' : 'asc';
    dispatch(setSortOrder(mapped));
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
      {/* Filter Button Section */}
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-green-800">Filters</h2>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
          onClick={() => setDrawerOpen(true)}
        >
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Sort Order Dropdown */}
      <select
        className="border border-green-700 rounded px-3 py-2 text-green-800 focus:outline-none"
        value={sortOrder === 'asc' ? 'price_asc' : 'price_desc'}
        onChange={(e) => handleSortChange(e.target.value)}
      >
        <option value="price_asc">Price: Low → High</option>
        <option value="price_desc">Price: High → Low</option>
      </select>

      {/* Filter Drawer Component */}
      <CategoryFilterDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        categories={categories}
        selectedCategoryIds={selectedCategories}
        onChange={(id) => dispatch(toggleCategory(id))}
      />
    </div>
  );
}
