"use client";

import MobileDataViewer from "@/components/data-viewer/Mobile";
import DesktopDataViewer from "@/components/data-viewer/desktop";
import { useWindowDimensions } from "@/hooks/use-window-dimensions";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { getProductById, resetProduct } from "@/redux/actions/productById";
import { ProductByIdState } from "@/redux/slices/productById";
import { useSearchParams } from "next/navigation";
import { memo, useEffect } from "react";

interface ProductProps {
  params: { id: string };
}

const Product = memo(({ params }: ProductProps): JSX.Element => {
  console.log("render");
  const { width } = useWindowDimensions();
  const dispatch = useAppDispatch();
  const { product, loading } = useAppSelector<ProductByIdState>(
    (state) => state.productById,
  );
  const searchParams = useSearchParams();
  const variantId = searchParams.get("variantId");

  useEffect(() => {
    dispatch(getProductById(params.id));

    // Reset product back to initialState
    return () => {
      dispatch(resetProduct());
    };
  }, [dispatch, params.id]);

  return (
    <>
      {/* There is two section one for the view less than 1024 and another of greater than or equal to 1024 */}
      {loading === "succeeded" ? (
        width > 1024 ? (
          <DesktopDataViewer
            product={product as RollingTypes.ProductById}
            variantId={variantId as string}
          />
        ) : (
          <MobileDataViewer
            product={product as RollingTypes.ProductById}
            variantId={variantId as string}
          />
        )
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
});

Product.displayName = "Product";
export default Product;
