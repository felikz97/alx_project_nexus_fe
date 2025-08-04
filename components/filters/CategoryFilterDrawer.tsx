// /components/filters/CategoryFilterDrawer.tsx

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Category {
  id: number;
  name: string;
}

interface CategoryFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategoryIds: number[];
  onChange: (categoryId: number) => void;
}

export default function CategoryFilterDrawer({
  isOpen,
  onClose,
  categories,
  selectedCategoryIds,
  onChange,
}: CategoryFilterDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            className="fixed left-0 top-0 h-full w-[90%] sm:w-72 bg-white z-50 p-6 overflow-y-auto shadow-lg"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <h3 className="text-lg font-bold mb-4 text-green-800">Filter by Category</h3>

            <ul className="space-y-3">
              {categories.map((category) => {
                const isSelected = selectedCategoryIds.includes(category.id);
                return (
                  <li key={category.id}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onChange(category.id)}
                        className="accent-green-600"
                      />
                      <span className="text-green-700">{category.name}</span>
                    </label>
                  </li>
                );
              })}
            </ul>

            <button
              onClick={onClose}
              className="mt-6 w-full bg-green-700 text-white py-2 rounded hover:bg-green-800"
            >
              Apply Filters
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
