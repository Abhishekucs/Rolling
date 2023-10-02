import { createAsyncThunk } from "@reduxjs/toolkit";
import Rolling from "@/init/api";

const GET_PRODUCTS = "product/getProducts";

export const getProductList = createAsyncThunk<
  RollingTypes.Product[],
  RollingTypes.ProductQuery,
  { rejectValue: string }
>(
  GET_PRODUCTS,
  async (query: RollingTypes.ProductQuery, { rejectWithValue }) => {
    const response = await Rolling.product.getProducts({ ...query });

    if (response.status !== 200) {
      return rejectWithValue(response.message);
    }
    return response.data;
  },
);
