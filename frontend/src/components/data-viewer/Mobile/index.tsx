import MobileCarousel from "@/components/carousel/mobile";
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
  useState,
} from "react";

const MobileDataViewer = memo(
  ({
    product,
    variantId,
  }: {
    product: RollingTypes.ProductById;
    variantId: string;
  }): JSX.Element => {
    console.log("render");
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

    const handleLongButtonClick = useCallback(() => {
      // If the user is not logged in, store the item in local storage
      console.log("add to cart");
    }, []);

    return (
      <section className="w-full min-h-screen">
        <MobileCarousel images={images} />
        <div className="bg-brown-500 w-full base-layout py-2">
          <ProductAndPrice name={product.name} price={price} />
          <MobileOptions
            label="Color"
            options={color}
            selected={selectedColor}
            setValue={setSelectedColor}
          />
          <MobileOptions
            label="Sizes"
            options={sizes}
            selected={selectedSize}
            setValue={setSelectedSize}
          />
          <Button handleLongButtonClick={handleLongButtonClick} />
        </div>
      </section>
    );
  },
);

const ProductAndPrice = memo(
  ({ name, price }: { name: string; price: number }): JSX.Element => (
    <div className="flex flex-col py-5">
      <ProductName
        type="MobileView"
        titles={splitString(name)}
        className="flex gap-x-1"
      />
      <div className="pt-1 flex">
        <h2 className="font-[300] text-sm text-brown-200">&#8377;</h2>
        <h2 className="font-[300] text-sm text-brown-200">{price}</h2>
      </div>
    </div>
  ),
);

ProductAndPrice.displayName = "ProductAndPrice";

const Button = memo(
  ({
    handleLongButtonClick,
  }: {
    handleLongButtonClick: () => void;
  }): JSX.Element => (
    <div className="flex flex-col border-t-[1px] border-brown-200/20 py-6">
      <LongButton text="ADD TO CART" onClick={handleLongButtonClick}>
        <Cart className="text-brown-200 fill-current h-4 w-4" />
      </LongButton>
    </div>
  ),
);

Button.displayName = "Button";

const MobileOptions = memo(
  ({
    label,
    options,
    selected,
    setValue,
  }: {
    label: string;
    options: string[];
    selected: string;
    setValue: Dispatch<SetStateAction<string>>;
  }): JSX.Element => {
    return (
      <div className="flex flex-col border-t-[1px] border-brown-200/20 py-5">
        <span className="text-sm font-[100] tracking-wider text-brown-200/50">
          {label}
        </span>
        <div className="pt-1">
          {options.map((value, index) => {
            return (
              <div className="inline-block even:px-3" key={index}>
                <button
                  className="font-[300] text-brown-200 text-base"
                  onClick={(): void => setValue(value)}
                >
                  <span
                    className={`decoration-dotted underline-offset-4 ${
                      selected.toLowerCase() === value.toLowerCase()
                        ? "no-underline text-brown-200/50"
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
    );
  },
);
MobileOptions.displayName = "MobileOptions";

MobileDataViewer.displayName = "MobileDataViewer";
export default MobileDataViewer;
