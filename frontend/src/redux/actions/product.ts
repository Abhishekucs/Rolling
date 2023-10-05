import { createAsyncThunk } from "@reduxjs/toolkit";
import Rolling from "@/init/api";

const GET_PRODUCTS = "product/getProducts";

export const getProductList = createAsyncThunk<
  RollingTypes.Product[],
  RollingTypes.ProductQuery,
  {
    rejectValue: string;
    state: { product: { loading: string; currentRequestId: string } };
  }
>(
  GET_PRODUCTS,
  async (
    query: RollingTypes.ProductQuery,
    { rejectWithValue, getState, requestId },
  ) => {
    const response = await Rolling.product.getProducts({ ...query });
    const { loading, currentRequestId } = getState().product;

    if (loading !== "pending" || requestId !== currentRequestId) {
      return;
    }

    if (response.status !== 200) {
      return rejectWithValue(response.message);
    }
    return response.data;
  },
);
