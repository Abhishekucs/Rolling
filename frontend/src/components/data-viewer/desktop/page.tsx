import DesktopCarousel from "@/components/carousel/desktop";
import { HeroFooter } from "@/components/hero/footer";
import { Cart } from "@/components/icons";
import LongButton from "@/components/long-button";
import ProductName from "@/components/product-name";
import { splitString } from "@/utils/misc";
import { useEffect, useState } from "react";

const color = ["red", "blue", "yellow"];
//const size = ["S", "M", "L"];

interface DesktopDataViewerProps {
  product: RollingTypes.ProductById;
}

export default function DesktopDataViewer({
  product,
}: DesktopDataViewerProps): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);
  const imagesData = product?.variants.images.map((image, index) => {
    const name = product.name + index;
    return {
      image: image,
      name,
    };
  }) as { image: string; name: string }[];

  useEffect(() => {
    const interval = setInterval(() => {
      // Slide to the next item
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imagesData.length);
    }, 4500); // Default to 4.5 second

    // Clear the interval when the component is unmounted or when currentIndex changes
    return () => {
      clearInterval(interval);
    };
  }, [currentIndex, imagesData.length]);
  return (
    <section className="w-screen h-screen">
      <div className="absolute z-[999] flex w-full h-full items-center base-layout">
        <div className="flex flex-col justify-between items-start basis-2/5 h-full">
          <div className="pt-40">
            <ProductName
              titles={splitString(product?.name as string)}
              className="pb-10"
            />
            <div className="h-px bg-brown-300/10 w-full" />
            <Options index={1} options={color} label="Color" />
            <div className="h-px bg-brown-300/10 w-full" />
            <Options index={2} options={["S, M, L"]} label="Size" />
          </div>
          <div className="flex items-center pb-20">
            <h2 className="font-[400] text-3xl mr-8">
              <span>&#8377;</span>
              <span>599</span>
            </h2>
            <LongButton
              text="Add to Cart"
              onClick={(): void => console.log("added to cart")}
            >
              <Cart className="text-brown-200 fill-current h-5 w-5" />
            </LongButton>
          </div>
        </div>
        <div className="flex flex-col h-full basis-2/5 justify-between items-end">
          <HeroFooter
            onRightClick={function (): void {
              throw new Error("Function not implemented.");
            }}
            onLeftClick={function (): void {
              throw new Error("Function not implemented.");
            }}
            length={0}
            currentIndex={0}
          />
        </div>
      </div>
      <DesktopCarousel imageData={imagesData} currentIndex={currentIndex} />
    </section>
  );
}

export function Options({
  index,
  options,
  label,
}: {
  index: number;
  options: string[];
  label: string;
}): JSX.Element {
  return (
    <div className="flex py-5 w-full">
      <span className="basis-2/6 text-brown-300 font-[200] text-border-white">{`0${index}`}</span>
      <div className="flex flex-col flex-1">
        <span className="font-[200] text-brown-300/60 text-border-white text-sm">
          {label}
        </span>
        <div>
          {options.map((value, index) => {
            return (
              <button
                key={index}
                className="even:px-3 font-[300] text-brown-500 text-base"
              >
                {value.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
