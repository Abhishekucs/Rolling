import { createSlice } from "@reduxjs/toolkit";

interface CategoryState {
  currentCategory: "t-shirt" | "hoodie";
}

const initialState: CategoryState = {
  currentCategory: "t-shirt",
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.currentCategory = action.payload;
    },
    getCategory: (state, _) => {
      state.currentCategory;
    },
  },
});

export const { setCategory, getCategory } = categorySlice.actions;
export default categorySlice.reducer;
