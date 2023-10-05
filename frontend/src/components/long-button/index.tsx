import cntl from "cntl";

type ButtonType = "button" | "reset" | "submit" | undefined;

const primary = cntl`
	bg-brown-300
	hover:opacity-80
	active:bg-brown-500
	text-brown-200
`;
const outline = cntl`
	bg-transparent
	border
	border-brown-300
	hover:bg-brown-300/10
	active:border-brown-500
	text-brown-500
`;

const buttonTypes = {
  primary,
  outline,
};

export const button = (
  type: keyof typeof buttonTypes = "primary",
  width = "auto",
  className = "",
): string => cntl`
	relative
	w-${width}
	${buttonTypes[type]}
	select-none
	active:transition-all
	active:duration-100
	text-center
	${className}
`;

interface CTAProps {
  type?: keyof typeof buttonTypes;
  width?: string;
  onClick?: () => void;
  children?: JSX.Element | string;
  className?: string;
  text?: string;
  buttonType?: ButtonType;
  childClassName?: string;
}

export default function LongButton({
  type = "primary",
  onClick,
  buttonType = "button",
  width = "auto",
  className = "",
  children,
  childClassName = "",
  text,
}: CTAProps): JSX.Element {
  return (
    <button
      type={buttonType}
      onClick={onClick}
      className={`flex items-center gap-x-2 justify-center py-4 px-10 rounded-full ${button(
        type,
        width,
      )} ${className}`}
    >
      <div className={`${childClassName}`}>{children}</div>
      <span className={`font-[400] text-base`}>{text}</span>
    </button>
  );
}
