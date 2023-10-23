import { createSlice } from "@reduxjs/toolkit";
import { getProductList, resetProduct } from "../actions/product";

export interface ProductState {
  products: RollingTypes.Product[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  errorMessage: string | null | undefined;
  currentRequestId: string | undefined;
}

const initialState: ProductState = {
  products: [],
  loading: "idle",
  errorMessage: null,
  currentRequestId: undefined,
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProductList.fulfilled, (state, action) => {
        const { requestId } = action.meta;
        if (
          state.loading === "pending" &&
          state.currentRequestId === requestId
        ) {
          state.loading = "succeeded";
          if (Array.isArray(action.payload)) {
            state.products.push(...action.payload);
          }
          state.currentRequestId = undefined;
        }
      })
      .addCase(getProductList.rejected, (state, action) => {
        const { requestId } = action.meta;
        if (
          state.loading === "pending" &&
          state.currentRequestId === requestId
        ) {
          state.loading = "failed";
          if (action.payload) {
            state.errorMessage = action.payload;
          } else {
            state.errorMessage = action.error.message;
          }
          state.currentRequestId = undefined;
        }
      })
      .addCase(getProductList.pending, (state, action) => {
        if (state.loading === "idle") {
          state.loading = "pending";
          state.currentRequestId = action.meta.requestId;
        }
      })
      .addCase(resetProduct, () => {
        return initialState;
      });
  },
});

export default productSlice.reducer;
