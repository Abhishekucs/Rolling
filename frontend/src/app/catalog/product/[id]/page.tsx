"use client";

import MobileCarousel from "@/components/carousel/mobile";
import DesktopDataViewer from "@/components/data-viewer/desktop/page";
import { useWindowDimensions } from "@/hooks/use-window-dimensions";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { getProductById, resetProduct } from "@/redux/actions/productById";
import { ProductByIdState } from "@/redux/slices/productById";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface ProductProps {
  params: { id: string };
}

export default function Product({ params }: ProductProps): JSX.Element {
  console.log("render");
  const { width } = useWindowDimensions();
  const dispatch = useAppDispatch();
  const { product, loading } = useAppSelector<ProductByIdState>(
    (state) => state.productById,
  );
  const searchParams = useSearchParams();
  const variantId = searchParams.get("variantId");

  useEffect(() => {
    dispatch(getProductById({ productId: params.id, variantId: variantId }));

    // Reset product back to initialState
    return () => {
      dispatch(resetProduct());
    };
  }, [dispatch, params.id, variantId]);

  return (
    <>
      {/* There is two section one for the view less than 1024 and another of greater than or equal to 1024 */}
      {loading === "succeeded" ? (
        width > 1024 ? (
          <DesktopDataViewer product={product as RollingTypes.ProductById} />
        ) : (
          <section className="flex flex-col items-start w-full h-full">
            <MobileCarousel
              product={product as RollingTypes.ProductById}
              className="basis-3/4"
            />
            <div className="flex-1">product info</div>
          </section>
        )
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
