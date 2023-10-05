import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import Rolling from "@/init/api";

export const resetProduct = createAction("product/resetById");

const GET_PRODUCTS_BY_ID = "product/getProductById";

export const getProductById = createAsyncThunk<
  RollingTypes.ProductById,
  {
    productId: string;
    variantId: string;
  },
  {
    rejectValue: string;
    state: { productById: { loading: string; currentRequestId: string } };
  }
>(
  GET_PRODUCTS_BY_ID,
  async (
    { productId, variantId },
    { rejectWithValue, getState, requestId },
  ) => {
    const response = await Rolling.product.getProductById(productId, variantId);
    const { loading, currentRequestId } = getState().productById;

    if (loading !== "pending" || requestId !== currentRequestId) {
      return;
    }

    if (response.status !== 200) {
      return rejectWithValue(response.message);
    }
    return response.data;
  },
);
