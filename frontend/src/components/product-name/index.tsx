import cntl from "cntl";
import { memo } from "react";

const DesktopView = cntl`
	text-2xl
	sm:text-4xl
	md:text-5xl
	lg:text-6xl
	xl:text-7xl
	2xl:text-8xl
	sm:first:ml-14
	md:first:ml-20
	lg:first:ml-24
	2xl:first:ml-32
	mb-4
	sm:mb-0
	leading-1
	text-brown-300
`;

const MobileView = cntl`
	text-base
	text-brown-200
`;

const viewTypes = {
  MobileView,
  DesktopView,
};

const buildText = (
  type: keyof typeof viewTypes = "DesktopView",
  index: number,
  length: number,
): string => cntl`
${index === length - 1 ? "sm:ml-7 md:ml-7 lg:ml-10 2xl:ml-20" : "ml-0"}
${viewTypes[type]}
`;

interface IProductNameProps {
  titles: string[];
  className?: string;
  type?: keyof typeof viewTypes;
  childClassName?: string;
}

const ProductName = memo(
  ({
    titles,
    className = "",
    type = "DesktopView",
    childClassName = "",
  }: IProductNameProps): JSX.Element => {
    return (
      <div className={className}>
        {titles.map((title, index) => {
          return (
            <h1
              key={index}
              className={`uppercase font-[300] text-border-white  ${buildText(
                type,
                index,
                titles.length,
              )} ${childClassName}`}
            >
              {index === titles.length - 1 ? `"${title}"` : title}
            </h1>
          );
        })}
      </div>
    );
  },
);
ProductName.displayName = "ProductName";
export default ProductName;
