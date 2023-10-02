import { ChevronLeft, ChevronRight } from "@/components/icons";
import { ProductInfo } from "@/components/product-info";
import { useWindowDimensions } from "@/hooks/use-window-dimensions";
import cntl from "cntl";
import Image from "next/image";
import { useEffect, useState } from "react";

const active = cntl`
	w-[10px]
	h-[10px]
`;
const inactive = cntl`
	w-[7px]
	h-[7px]
`;

export function MobileHeroFooter({
  onRightClick,
  onLeftClick,
  length,
  currentIndex,
}: {
  onRightClick: () => void;
  onLeftClick: () => void;
  length: number;
  currentIndex: number;
}): JSX.Element {
  return (
    <div className="flex justify-between pb-10">
      <div className="flex items-end">
        <div className="mr-4">
          <button onClick={onLeftClick}>
            <ChevronLeft />
          </button>
        </div>
        <div className="flex text-brown-300">
          <span className="text-brown-300 text-2xl text-border-white">
            {`0${currentIndex + 1}`}
          </span>
          /{" "}
          <span className="text-brown-300 text-border-white">{`0${length}`}</span>
        </div>
      </div>
      <div className="z-[9999999]">
        <button onClick={onRightClick}>
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}

export function HeroFooter({
  onRightClick,
  onLeftClick,
  length,
  currentIndex,
}: {
  onRightClick: () => void;
  onLeftClick: () => void;
  length: number;
  currentIndex: number;
}): JSX.Element {
  return (
    <div className="pb-10 lg:pb-28 flex-col z-[99999999] ">
      <div className="flex justify-between sm:flex-col">
        <div className="flex items-center justify-end sm:mb-8">
          <div className="flex md:pr-20 lg:pr-24 xl:pr-28 items-center">
            {Array.from({ length: length }, (_, index) => (
              <div
                key={index}
                className={` bg-brown-300 rounded-full even:mx-3 ${
                  index === currentIndex ? active : inactive
                }`}
              ></div>
            ))}
          </div>
          <div className="ml-[5vw] lg:ml-[5px]">
            <button onClick={onRightClick}>
              <ChevronRight />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <div className="flex md:pr-20 lg:pr-24 xl:pr-28 text-brown-300">
            <span className="text-brown-300 text-2xl text-border-white">
              {`0${currentIndex + 1}`}
            </span>
            /{" "}
            <span className="text-brown-300 text-border-white">{`0${length}`}</span>
          </div>
          <div className="ml-[5vw] lg:ml-[5px]">
            <button onClick={onLeftClick}>
              <ChevronLeft />
            </button>
          </div>
        </div>
      </div>
      <div className="justify-end mt-24 hidden sm:flex">
        <div className="md:pr-20 lg:pr-24 xl:pr-28 flex-col ">
          <span className="uppercase block text-brown-300 text-3xl font-[200] text-border-white text-right">
            made with love
          </span>
          <span className="uppercase block text-brown-300 text-3xl font-[200] text-border-white text-right -my-2">
            unisex
          </span>
          <span className="uppercase block text-brown-300 text-3xl font-[200] text-border-white text-right">
            clothing
          </span>
        </div>
        <div className="ml-[5vw] lg:ml-[5px]">
          <span className="text-brown-300">&copy;</span>
        </div>
      </div>
    </div>
  );
}

export default function Carousel({
  products,
}: {
  products: RollingTypes.Product[];
}): JSX.Element {
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Slide to the next item
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 4500); // Slide every 4.5 second

    // Clear the interval when the component is unmounted or when currentIndex changes
    return () => clearInterval(interval);
  }, [currentIndex, products.length]);

  const handlePrev = (): void => {
    // Slide to the previous item
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + products.length) % products.length,
    );
  };

  const handleNext = (): void => {
    // Slide to the next product
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  return (
    <>
      <div className="relative">
        <div className={`h-screen w-screen overflow-hidden`}>
          <div
            className={`flex w-full h-full transition duration-500`}
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {products.map((product, index) => {
              return (
                <div key={index} className={`w-full h-full shrink-0 relative`}>
                  <Image
                    src={product.variants.images[1]}
                    alt={product.name}
                    fill
                    style={{
                      objectFit: "cover",
                    }}
                    property="true"
                    quality={95}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-[22px] md:px-[44px] lg:px-[60px] xl:px-[96px] absolute top-0 left-0 w-screen h-screen flex flex-col justify-between">
        <ProductInfo
          titles={products[currentIndex]?.name.split(" ") as string[]}
          price={products[currentIndex]?.variants.price as number}
          width={width}
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
