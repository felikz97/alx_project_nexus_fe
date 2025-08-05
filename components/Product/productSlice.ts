import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProductFilterState {
  selectedCategories: number[];
  searchTerm: string;
  sortOrder: 'asc' | 'desc';
}

const initialState: ProductFilterState = {
  selectedCategories: [],
  searchTerm: '',
  sortOrder: 'asc',
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    toggleCategory(state, action: PayloadAction<number>) {
      const id = action.payload;
      if (state.selectedCategories.includes(id)) {
        state.selectedCategories = state.selectedCategories.filter(cat => cat !== id);
      } else {
        state.selectedCategories.push(id);
      }
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    toggleSortOrder(state) {
      state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
    },
    setSortOrder(state, action: PayloadAction<'asc' | 'desc'>) {
      state.sortOrder = action.payload;
    },
    clearFilters(state) {
      state.selectedCategories = [];
      state.searchTerm = '';
      state.sortOrder = 'asc';
    },
  },
});

export const {
  toggleCategory,
  setSearchTerm,
  toggleSortOrder,
  setSortOrder,
  clearFilters,
} = productSlice.actions;
export default productSlice.reducer;
