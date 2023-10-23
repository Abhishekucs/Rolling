import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import Rolling from "@/init/api";
import { ProductState } from "../slices/product";

const GET_PRODUCTS = "product/getProducts";
const RESET_PRODUCT = "product/resetProduct";

export const resetProduct = createAction(RESET_PRODUCT);

export const getProductList = createAsyncThunk<
  RollingTypes.Product[],
  RollingTypes.ProductQueryWithPagination,
  {
    state: { product: ProductState };
    rejectValue: string;
  }
>(
  GET_PRODUCTS,
  async (
    query: RollingTypes.ProductQueryWithPagination,
    { rejectWithValue },
  ) => {
    // TODO: check connection status here

    // const { loading, currentRequestId } = getState().product;
    // if (loading !== "pending" || requestId !== currentRequestId) {
    //   return;
    // }

    try {
      const response = await Rolling.product.getProducts({ ...query });

      if (response.status !== 200) {
        throw response.message;
      }
      return response.data;
      /* eslint-disable  @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      return rejectWithValue(error);
    }
  },
);
