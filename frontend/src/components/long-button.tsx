import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

type ButtonType = "button" | "reset" | "submit" | undefined;

export default function LongButton({
  logoSrc,
  text,
  backgroundColor,
  textColor,
  border,
  borderColor,
  borderWidth,
  onClick,
  type,
}: {
  logoSrc?: string | StaticImport;
  text: string;
  backgroundColor?: string;
  textColor?: string;
  border?: boolean;
  borderColor?: string;
  borderWidth?: string;
  type?: ButtonType;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full flex items-center gap-x-2 justify-center py-4 rounded-xl ${
        backgroundColor ? backgroundColor : "bg-transparent"
      } ${border && "border"} ${
        borderColor ? borderColor : "border-transparent"
      } ${borderWidth ? borderWidth : "border-0"}`}
    >
      {logoSrc && (
        <div className="w-6 h-6">
          <Image src={logoSrc} alt="GoogleLogo" />
        </div>
      )}
      <span
        className={`font-causten-bold text-base ${
          textColor ? textColor : "text-white"
        }`}
      >
        {text}
      </span>
    </button>
  );
}
