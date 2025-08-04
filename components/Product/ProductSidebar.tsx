// /components/Product/ProductSidebar.tsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toggleCategory } from '@/components/Product/productSlice';
import CategoryFilterDrawer from '@/components/filters/CategoryFilterDrawer';
import { RootState } from '@/components/store/store/store';
import { Filter } from 'lucide-react';

type Category = {
  id: number;
  name: string;
};

export default function ProductSidebar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const selectedCategories = useSelector((state: RootState) => state.product.selectedCategories);
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get('http://localhost:8000/api/categories/')
      .then(res => setCategories(res.data.results || res.data))
      .catch(err => console.error('Failed to load categories:', err));
  }, []);

  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-green-800">Filters</h2>

      {/* Filter Button (Mobile + Desktop) */}
      <button
        className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
        onClick={() => setDrawerOpen(true)}
      >
        <Filter className="w-4 h-4" />
        Filter
      </button>

      {/* Category Drawer */}
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
