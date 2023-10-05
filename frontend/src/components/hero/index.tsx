"use client";

import { useWindowDimensions } from "@/hooks/use-window-dimensions";
import { CircleDesign } from "../circle";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { ProductState } from "@/redux/slices/product";
import { useEffect } from "react";
import { getProductList } from "@/redux/actions/product";
import Loader from "../Loader";
import DataViewer from "./data-viewer";

export default function Hero(): JSX.Element {
  const { width } = useWindowDimensions();

  const dispatch = useAppDispatch();
  const { products, loading, errorMessage } = useAppSelector<ProductState>(
    (state) => state.product,
  );

  useEffect(() => {
    dispatch(
      getProductList({
        category: undefined,
        color: undefined,
        skip: 0,
        limit: 3,
        filter: undefined,
      }),
    );
  }, [dispatch]);

  return (
    <section className="w-screen h-screen">
      <CircleDesign width={width} />
      {loading === "succeeded" ? (
        <DataViewer products={products} />
      ) : loading === "failed" ? (
        <div>{errorMessage}</div>
      ) : (
        <Loader />
      )}
    </section>
  );
}
