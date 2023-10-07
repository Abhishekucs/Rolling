import DesktopController from "@/components/Controllers/Desktop";
import DesktopCarousel from "@/components/carousel/desktop";
import { Cart } from "@/components/icons";
import LongButton from "@/components/long-button";
import ProductName from "@/components/product-name";
import { splitString } from "@/utils/misc";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

interface DesktopDataViewerProps {
  product: RollingTypes.ProductById;
  variantId: string;
}

const DesktopDataViewer = memo(
  ({ product, variantId }: DesktopDataViewerProps): JSX.Element => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [price, setPrice] = useState(0);
    const [color, setColor] = useState<string[]>([]);
    const [sizes, setSizes] = useState<string[]>([]);
    const [selectedColor, setSelectedColor] = useState("");
    const [images, setImages] = useState<string[]>([]);

    const [selectedSize, setSelectedSize] = useState("");

    const router = useRouter();

    useEffect(() => {
      product.variants.forEach((variant) => {
        setColor((prevColor) => [...prevColor, variant.color]);
        if (variant._id === variantId) {
          setImages([...variant.images]);
          setSelectedColor(variant.color);
          setPrice(variant.price);
          variant.sizes.map((size) => {
            const value = Object.keys(size)[0];
            setSizes((prevSize) => [...prevSize, value]);
          });

          return;
        }
      });
    }, [product.variants, variantId]);

    useEffect(() => {
      const variant = product.variants.find(
        (ele) => ele.color === selectedColor,
      );
      if (variant && variant._id !== variantId) {
        const id = product._id;
        router.replace(`/catalog/product/${id}?variantId=${variant?._id}`);
      }
    }, [selectedColor, product._id, product.variants, router, variantId]);

    useEffect(() => {
      const interval = setInterval(() => {
        // Slide to the next item
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 4500); // Default to 4.5 second

      // Clear the interval when the component is unmounted or when currentIndex changes
      return () => {
        clearInterval(interval);
      };
    }, [currentIndex, images.length]);

    const handleNext = useCallback((): void => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, [images]);

    const handlePrev = useCallback((): void => {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + images.length) % images.length,
      );
    }, [images]);

    const handleLongButtonClick = useCallback(
      () => console.log("add to cart"),
      [],
    );

    const productName = useMemo(
      () => splitString(product.name),
      [product.name],
    );

    return (
      <section className="w-screen h-screen">
        <div className="absolute z-[999] flex w-full h-full items-center justify-between base-layout">
          <div className="flex flex-col justify-between items-start basis-2/5 h-full">
            <div className="pt-40">
              <ProductName titles={productName} className="pb-10" />
              <div className="h-px bg-brown-300/10 w-full" />
              <Options
                index={1}
                options={color}
                label="Color"
                selected={selectedColor}
                setValue={setSelectedColor}
              />
              <div className="h-px bg-brown-300/10 w-full" />
              <Options
                index={2}
                options={sizes}
                label="Size"
                selected={selectedSize}
                setValue={setSelectedSize}
              />
            </div>
            <PriceAndCTA price={price} onClick={handleLongButtonClick} />
          </div>
          <div className="flex flex-col h-full justify-end pb-20 flex-1">
            <NextImageViewer imagesData={images} currentIndex={currentIndex} />
            <DesktopController
              currentIndex={currentIndex}
              length={images.length}
              onLeftClick={handlePrev}
              onRightClick={handleNext}
            />
          </div>
        </div>
        <div className="h-screen w-screen">
          <DesktopCarousel imageData={images} currentIndex={currentIndex} />
        </div>
      </section>
    );
  },
);

const Options = memo(
  ({
    index,
    options,
    label,
    selected,
    setValue,
  }: {
    index: number;
    options: string[];
    label: string;
    selected: string;
    setValue: Dispatch<SetStateAction<string>>;
  }): JSX.Element => {
    return (
      <div className="flex py-5 w-full">
        <span className="basis-2/6 text-brown-300 font-[200] text-border-white">{`0${index}`}</span>
        <div className="flex flex-col flex-1">
          <span className="font-[200] text-brown-300/50 text-border-white text-sm">
            {label}
          </span>
          <div>
            {options.map((value, index) => {
              return (
                <div className="even:px-3 inline-block" key={index}>
                  <button
                    className=" font-[300] text-brown-500 text-base"
                    onClick={(): void => setValue(value)}
                  >
                    <span
                      className={`decoration-dotted underline-offset-4 ${
                        selected.toLowerCase() === value.toLowerCase()
                          ? "no-underline text-brown-500/50"
                          : "underline"
                      }`}
                    >
                      {value.toUpperCase()}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
);

Options.displayName = "Options";

const PriceAndCTA = memo(
  ({ price, onClick }: { price: number; onClick: () => void }): JSX.Element => {
    return (
      <div className="flex items-center pb-20">
        <h2 className="font-[400] text-3xl mr-8 text-brown-300 text-border-white">
          <span>&#8377;</span>
          <span>{price}</span>
        </h2>
        <LongButton text="Add to Cart" onClick={onClick}>
          <Cart className="text-brown-200 fill-current h-5 w-5" />
        </LongButton>
      </div>
    );
  },
);

PriceAndCTA.displayName = "PriceAndCTA";

const NextImageViewer = memo(
  ({
    imagesData,
    currentIndex,
  }: {
    imagesData: string[];
    currentIndex: number;
  }): JSX.Element => {
    return (
      <div className="max-w-content h-[45vh] mb-16 flex justify-end">
        <div className="w-[20vw] h-full flex">
          <DesktopCarousel
            imageData={imagesData}
            currentIndex={(currentIndex + 1) % imagesData.length}
          />
        </div>
      </div>
    );
  },
);
NextImageViewer.displayName = "NextImageViewer";

DesktopDataViewer.displayName = "DesktopDataViewer";
export default DesktopDataViewer;
