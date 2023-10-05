import { CircleButton } from "../circle-button";
import { RightArrow } from "../icons";
import ProductName from "../product-name";

interface ProductInfo {
  titles: string[];
  price: number;
  height?: number;
  width?: number;
  handleButtonClick: () => void;
}

export const ProductInfo = ({
  titles,
  price,
  width,
  handleButtonClick,
}: ProductInfo): JSX.Element => {
  return (
    <div className="pt-40 pl-2 xl:pt-80 xl:-translate-y-32">
      <ProductName titles={titles} />
      <div className="sm:ml-20 mt-10 ">
        <h2 className="uppercase text-brown-300 font-[200] text-border-white text-xl sm:text-4xl leading-1 ">
          <span className="font-[400]">&#8377;</span>
          {`${price}`}
        </h2>
      </div>
      <CircleButton
        className="mt-8 sm:ml-[25vw]"
        size={width !== undefined && width > 1024 ? "lg" : "sm"}
        handleClick={handleButtonClick}
      >
        <RightArrow />
      </CircleButton>
    </div>
  );
};
