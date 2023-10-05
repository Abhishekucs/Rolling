import { createSlice } from "@reduxjs/toolkit";
import { getProductList } from "../actions/product";

export interface ProductState {
  products: RollingTypes.Product[];
  errorMessage: string | null | undefined;
  loading: "idle" | "pending" | "succeeded" | "failed";
  currentRequestId: string | undefined;
}

const initialState: ProductState = {
  products: [],
  errorMessage: null,
  loading: "idle",
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
          state.products.push(...action.payload);
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
          state.errorMessage = action.error.message;
          state.currentRequestId = undefined;
        }
      })
      .addCase(getProductList.pending, (state, action) => {
        if (state.loading === "idle") {
          state.loading = "pending";
          state.currentRequestId = action.meta.requestId;
        }
      });
  },
});

export default productSlice.reducer;
