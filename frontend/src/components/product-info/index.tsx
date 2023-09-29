import { CircleButton } from "../circle-button";
import { RightArrow } from "../icons";

interface ProductInfo {
  titles: string[];
  price: number;
  height?: number;
  width?: number;
}

export const ProductInfo = ({
  titles,
  price,
  width,
}: ProductInfo): JSX.Element => {
  return (
    <div className="relative top-40 left-2 z-50 xl:top-80 xl:-translate-y-32">
      <div className="sm:ml-10">
        {titles.map((title, index) => {
          return (
            <h1
              key={index}
              className={`uppercase text-brown-300 font-[300] text-border-white text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl leading-1 sm:first:ml-14 md:first:ml-20 lg:first:ml-24 2xl:first:ml-32 ${
                index === titles.length - 1
                  ? "sm:ml-7 md:ml-7 lg:ml-10 2xl:ml-20"
                  : "ml-0"
              }  mb-4 sm:mb-0`}
            >
              {index === titles.length - 1 ? `"${title}"` : title}
            </h1>
          );
        })}
      </div>
      <div className="sm:ml-20 mt-10 ">
        <h2 className="uppercase text-brown-300 font-[200] text-border-white text-xl sm:text-4xl leading-1 ">
          <span className="font-[400]">&#8377;</span>
          {`${price}`}
        </h2>
      </div>
      <CircleButton
        className="mt-8 sm:ml-[25vw]"
        size={width !== undefined && width > 1024 ? "lg" : "sm"}
      >
        <RightArrow />
      </CircleButton>
    </div>
  );
};
