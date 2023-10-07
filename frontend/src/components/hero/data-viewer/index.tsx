import ProductInfo from "@/components/product-info";
import { useWindowDimensions } from "@/hooks/use-window-dimensions";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HeroFooter, MobileHeroFooter } from "../footer";
import DesktopCarousel from "@/components/carousel/desktop";

export default function DataViewer({
  products,
}: {
  products: RollingTypes.Product[];
}): JSX.Element {
  console.log("rerender");
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      // Slide to the next item
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 4500); // Slide every 4.5 second

    // Clear the interval when the component is unmounted or when currentIndex changes
    return () => clearInterval(interval);
  }, [currentIndex, products.length]);

  const handlePrev = useCallback((): void => {
    // Slide to the previous item
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + products.length) % products.length,
    );
  }, [products]);

  const handleNext = useCallback((): void => {
    // Slide to the next product
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  }, [products]);

  const handleButtonClick = (id: string, variantId: string): void => {
    // push to the product/[id] route
    router.push(`/catalog/product/${id}?variantId=${variantId}`);
  };

  const imagesData = useMemo(
    () =>
      products.map((product) => {
        const firstImage = product.variants.images[0];
        return firstImage;
      }),
    [products],
  );

  return (
    <>
      <DesktopCarousel imageData={imagesData} currentIndex={currentIndex} />
      <div className="px-[22px] md:px-[44px] lg:px-[60px] xl:px-[96px] absolute top-0 left-0 w-screen h-screen flex flex-col sm:flex sm:flex-row  justify-between z-[99999]">
        <ProductInfo
          titles={products[currentIndex]?.name.split(" ") as string[]}
          price={products[currentIndex]?.variants.price as number}
          width={width}
          handleButtonClick={(): void =>
            handleButtonClick(
              products[currentIndex]._id,
              products[currentIndex].variants._id,
            )
          }
        />
        {width < 640 ? (
          <MobileHeroFooter
            currentIndex={currentIndex}
            length={products.length}
            onLeftClick={handlePrev}
            onRightClick={handleNext}
          />
        ) : (
          <HeroFooter
            currentIndex={currentIndex}
            length={products.length}
            onLeftClick={handlePrev}
            onRightClick={handleNext}
          />
        )}
      </div>
    </>
  );
}
