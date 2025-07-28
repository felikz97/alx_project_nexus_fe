import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProductFilterState {
  selectedCategories: number[];
  searchTerm: string;
}

const initialState: ProductFilterState = {
  selectedCategories: [],
  searchTerm: '',
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
    clearFilters(state) {
      state.selectedCategories = [];
      state.searchTerm = '';
    },
  },
});

export const { toggleCategory, setSearchTerm, clearFilters } = productSlice.actions;
export default productSlice.reducer;
