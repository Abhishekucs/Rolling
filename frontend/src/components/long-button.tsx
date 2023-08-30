import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

export default function LongButton({
  logoSrc,
  text,
  backgroundColor,
  textColor,
  border,
  borderColor,
  borderWidth,
}: {
  logoSrc?: string | StaticImport;
  text: string;
  backgroundColor?: string;
  textColor?: string;
  border?: boolean;
  borderColor?: string;
  borderWidth?: string;
}) {
  return (
    <div className="w-full py-5">
      <div
        className={`flex items-center justify-center py-3 rounded-xl ${
          backgroundColor ? backgroundColor : "bg-transparent"
        } ${border && "border"} ${
          borderColor ? borderColor : "border-transparent"
        } ${borderWidth ? borderWidth : "border-0"}`}
      >
        {logoSrc && (
          <div className="w-6 h-6 lg:w-12 lg:h-12">
            <Image src={logoSrc} alt="GoogleLogo" />
          </div>
        )}
        <div>
          <span
            className={`font-causten-bold text-base lg:text-xl ${
              textColor ? textColor : "text-white"
            }`}
          >
            {text}
          </span>
        </div>
      </div>
    </div>
  );
}
