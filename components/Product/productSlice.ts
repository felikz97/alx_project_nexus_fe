// components/common/products/productSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProductFilterState {
  selectedCategories: number[];
  searchTerm: string;
  sortOrder: 'asc' | 'desc'; // Sorting order for price
}

// Initial state
const initialState: ProductFilterState = {
  selectedCategories: [],
  searchTerm: '',
  sortOrder: 'asc',
};

// Redux slice for product filtering and sorting
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // Toggle a category on/off in the selected filter list
    toggleCategory: (state, action: PayloadAction<number>) => {
      const categoryId = action.payload;
      const index = state.selectedCategories.indexOf(categoryId);
      if (index !== -1) {
        state.selectedCategories.splice(index, 1);
      } else {
        state.selectedCategories.push(categoryId);
      }
    },

    // Set the search keyword
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },

    // Toggle price sort order between ascending and descending
    toggleSortOrder: (state) => {
      state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
    },

    // Explicitly set the price sort order
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },

    // Clear all filters to default
    clearFilters: (state) => {
      state.selectedCategories = [];
      state.searchTerm = '';
      state.sortOrder = 'asc';
    },
  },
});

// Export actions and reducer
export const {
  toggleCategory,
  setSearchTerm,
  toggleSortOrder,
  setSortOrder,
  clearFilters,
} = productSlice.actions;

export default productSlice.reducer;
