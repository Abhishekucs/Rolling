import { createSlice } from "@reduxjs/toolkit";
import { getProductList } from "../actions/product";

export interface ProductState {
  product: RollingTypes.ProductItem[];
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: ProductState = {
  product: [],
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
        state.product.push(action.payload.data);
      })
      .addCase(getProductList.rejected, (state) => {
        state.loading = "failed";
      })
      .addCase(getProductList.pending, (state) => {
        state.loading = "pending";
      });
  },
});

//export const { setProduct } = productSlice.actions;
export default productSlice.reducer;
