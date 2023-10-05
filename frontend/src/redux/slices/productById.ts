import { createSlice } from "@reduxjs/toolkit";
import { getProductById, resetProduct } from "../actions/productById";

export interface ProductByIdState {
  product: RollingTypes.ProductById | null;
  errorMessage: string | null | undefined;
  loading: "idle" | "pending" | "succeeded" | "failed";
  currentRequestId: string | undefined;
}

export const initialState: ProductByIdState = {
  product: null,
  errorMessage: null,
  loading: "idle",
  currentRequestId: undefined,
};

export const productByIdSlice = createSlice({
  name: "productById",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProductById.fulfilled, (state, action) => {
        const { requestId } = action.meta;
        if (
          state.loading === "pending" &&
          state.currentRequestId === requestId
        ) {
          state.loading = "succeeded";
          state.product = action.payload;
          state.currentRequestId = undefined;
        }
      })
      .addCase(getProductById.rejected, (state, action) => {
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
      .addCase(getProductById.pending, (state, action) => {
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

export default productByIdSlice.reducer;
