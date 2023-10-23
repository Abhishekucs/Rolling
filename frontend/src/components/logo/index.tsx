"use client";
import { CSSProperties } from "react";
import { motion, MotionStyle } from "framer-motion";

export default function Logo({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties | MotionStyle;
}): JSX.Element {
  return (
    <motion.svg
      className={`fill-current ${className}`}
      style={style}
      width="153"
      height="16"
      viewBox="0 0 153 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_2372_7735)">
        <path d="M0 15.8001V0.200057H7.56C9.864 0.200057 12.408 1.92806 12.408 5.45606C12.408 8.02406 11.04 9.65606 9.408 10.3281L12.744 15.8001H8.664L5.568 10.7121H3.528V15.8001H0ZM3.528 7.30406H6.96C7.968 7.30406 8.88 6.65606 8.88 5.45606C8.88 4.25606 7.968 3.63206 6.96 3.63206H3.528V7.30406Z" />
        <path d="M31.8101 15.9921C27.1781 15.9921 23.9381 12.6321 23.9381 8.00006C23.9381 3.36806 27.1781 0.00805664 31.8101 0.00805664C36.4421 0.00805664 39.6341 3.36806 39.6341 8.00006C39.6341 12.6321 36.4421 15.9921 31.8101 15.9921ZM31.8101 12.4641C34.4021 12.4641 36.1061 10.5921 36.1061 8.00006C36.1061 5.40806 34.4021 3.53606 31.8101 3.53606C29.2181 3.53606 27.4661 5.40806 27.4661 8.00006C27.4661 10.5921 29.2181 12.4641 31.8101 12.4641Z" />
        <path d="M51.4266 15.8001V0.200057H54.9546V12.5841H62.0826V15.8001H51.4266Z" />
        <path d="M73.7531 15.8001V0.200057H77.2811V12.5841H84.4091V15.8001H73.7531Z" />
        <path d="M96.0797 15.8001V0.200057H99.6077V15.8001H96.0797Z" />
        <path d="M111.727 15.8001V0.200057H115.135L121.087 9.56006V0.200057H124.615V15.8001H121.183L115.255 6.46406V15.8001H111.727Z" />
        <path d="M144.38 15.9921C139.748 15.9921 136.508 12.6321 136.508 8.00006C136.508 3.36806 139.748 0.00805664 144.38 0.00805664C147.14 0.00805664 149.348 1.20806 150.692 3.12806L147.836 5.24006C146.948 4.01606 145.628 3.53606 144.38 3.53606C141.788 3.53606 140.036 5.40806 140.036 8.00006C140.036 10.5921 141.788 12.4641 144.38 12.4641C145.844 12.4641 147.428 11.6721 147.812 9.99206H144.164V6.77606H151.868V8.36006C151.7 12.8001 148.892 15.9921 144.38 15.9921Z" />
      </g>
      <defs>
        <filter
          id="filter0_d_2372_7735"
          x="0"
          y="0.00805664"
          width="152.869"
          height="15.9839"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="1" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_2372_7735"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2372_7735"
            result="shape"
          />
        </filter>
      </defs>
    </motion.svg>
  );
}
