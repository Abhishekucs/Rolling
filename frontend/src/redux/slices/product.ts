import { createSlice } from "@reduxjs/toolkit";
import { getProductList } from "../actions/product";

export interface ProductState {
  products: RollingTypes.Product[];
  errorMessage: string | null | undefined;
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: ProductState = {
  products: [],
  errorMessage: null,
  loading: "idle",
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProductList.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.products.push(...action.payload);
      })
      .addCase(getProductList.rejected, (state, action) => {
        state.loading = "failed";
        if (action.payload) {
          state.errorMessage = action.payload;
        } else {
          state.errorMessage = action.error.message;
        }
      });
  },
});

export default productSlice.reducer;
