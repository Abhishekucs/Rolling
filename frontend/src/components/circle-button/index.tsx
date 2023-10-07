import cntl from "cntl";
import { memo } from "react";

const sizes = {
  sm: cntl`
		p-3
	`,
  md: cntl`
		p-4
	`,
  lg: cntl`
		p-6
	`,
};

const buildButton = (
  color: string,
  className = "",
  size: keyof typeof sizes = "lg",
): string => cntl`
	${color}
	${className}
	items-center
	${sizes[size]}
`;

const buildButtonContainer = (
  className = "",
  left: string,
  right: string,
  top: string,
  bottom: string,
): string => cntl`
z-[9999999]
${left}
${top}
${bottom}
${right}
${className}
`;

type CircleButtonTextPosition = "left" | "right";

interface CircleButtonProps {
  show?: boolean;
  textPosition?: CircleButtonTextPosition;
  handleClick?: () => void;
  text?: {
    first: string;
    last: string;
  };
  children: JSX.Element;
  className?: string;
  childClassName?: string;
  color?: string;
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  size?: keyof typeof sizes;
}

const CircleButton = memo(
  ({
    show = false,
    textPosition = "left",
    handleClick,
    text,
    children,
    className,
    childClassName,
    color = "bg-brown-300",
    left = "0",
    right = "0",
    bottom = "0",
    top = "0",
    size,
  }: CircleButtonProps): JSX.Element => {
    return (
      <>
        <div
          className={`${buildButtonContainer(
            "flex items-center",
            left,
            right,
            top,
            bottom,
          )} ${className} `}
        >
          {textPosition === "left" && show ? (
            <div className="mr-4">
              <p className="uppercase font-[400] leading-2 text-brown-300 text-lg tracking-wider text-border-white">
                {text?.first}
              </p>
              <p className="uppercase font-[400] text-brown-300 text-lg tracking-wider text-border-white">
                {text?.last}
              </p>
            </div>
          ) : null}
          <button
            className={`${buildButton(
              color,
              "rounded-full hover:opacity-80 active:bg-brown-500 div-border-white",
              size,
            )} ${childClassName}`}
            onClick={handleClick}
          >
            {children}
          </button>
          {textPosition === "right" && show ? (
            <div className="ml-4">
              <p className="uppercase font-[400] leading-2 text-brown-300 text-lg tracking-wider text-border-white">
                {text?.first}
              </p>
              <p className="uppercase font-[400] text-brown-300 text-lg tracking-wider text-border-white">
                {text?.last}
              </p>
            </div>
          ) : null}
        </div>
      </>
    );
  },
);

CircleButton.displayName = "CircleButton";
export default CircleButton;
