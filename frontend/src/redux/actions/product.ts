import { createAsyncThunk } from "@reduxjs/toolkit";
import Rolling from "@/init/api";

const GET_PRODUCTS = "product/getProducts";

// export const getProducts =
//   createAction<RollingTypes.ProductQuery>(GET_PRODUCTS);

export const getProductList = createAsyncThunk(
  GET_PRODUCTS,
  async (query: RollingTypes.ProductQuery) => {
    const response = await Rolling.product.getProducts({ ...query });

    return response;
  },
);
