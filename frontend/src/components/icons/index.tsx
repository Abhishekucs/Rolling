interface IconProps {
  color?: string;
  className?: string;
}

export const Catalog = (props: IconProps): JSX.Element => (
  <svg
    className={props.className}
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_d_2400_7943)">
      <path
        className={props.color}
        d="M6.6013 11.7248C7.7763 11.7248 8.71797 12.6757 8.71797 13.859V16.6998C8.71797 17.8748 7.7763 18.8332 6.6013 18.8332H3.78464C2.61797 18.8332 1.66797 17.8748 1.66797 16.6998V13.859C1.66797 12.6757 2.61797 11.7248 3.78464 11.7248H6.6013ZM16.2181 11.7248C17.3847 11.7248 18.3347 12.6757 18.3347 13.859V16.6998C18.3347 17.8748 17.3847 18.8332 16.2181 18.8332H13.4014C12.2264 18.8332 11.2847 17.8748 11.2847 16.6998V13.859C11.2847 12.6757 12.2264 11.7248 13.4014 11.7248H16.2181ZM6.6013 2.16675C7.7763 2.16675 8.71797 3.12508 8.71797 4.30091V7.14175C8.71797 8.32508 7.7763 9.27508 6.6013 9.27508H3.78464C2.61797 9.27508 1.66797 8.32508 1.66797 7.14175V4.30091C1.66797 3.12508 2.61797 2.16675 3.78464 2.16675H6.6013ZM16.2181 2.16675C17.3847 2.16675 18.3347 3.12508 18.3347 4.30091V7.14175C18.3347 8.32508 17.3847 9.27508 16.2181 9.27508H13.4014C12.2264 9.27508 11.2847 8.32508 11.2847 7.14175V4.30091C11.2847 3.12508 12.2264 2.16675 13.4014 2.16675H16.2181Z"
        fill="#3A3328"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_2400_7943"
        x="1.66797"
        y="2.16675"
        width="17.668"
        height="16.6665"
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
          result="effect1_dropShadow_2400_7943"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_2400_7943"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

export const Cart = (props: IconProps): JSX.Element => (
  <svg
    className={props.className}
    width="25"
    height="28"
    viewBox="0 0 25 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.5066 0.666748C16.0799 0.666748 19.0176 3.47463 19.1667 7.03251H19.1318C19.136 7.13593 19.1161 7.23892 19.0738 7.33341H19.2819C20.9046 7.33341 22.6038 8.45809 23.2851 11.1732L23.3592 11.4935L24.3843 19.7531C25.1221 25.0211 22.2399 27.2365 18.3083 27.3303L18.0446 27.3334H6.99137C2.9957 27.3334 -0.0832743 25.8774 0.593708 20.1115L0.639873 19.7531L1.67685 11.4935C2.18819 8.56966 3.90481 7.41641 5.55883 7.33777L5.74228 7.33341H5.84652C5.82894 7.23388 5.82894 7.13205 5.84652 7.03251C5.99563 3.47463 8.93333 0.666748 12.5066 0.666748ZM8.62933 11.7725C7.97852 11.7725 7.45094 12.3155 7.45094 12.9853C7.45094 13.6552 7.97852 14.1982 8.62933 14.1982C9.28013 14.1982 9.80772 13.6552 9.80772 12.9853L9.79853 12.8332C9.72582 12.2352 9.23007 11.7725 8.62933 11.7725ZM16.3478 11.7725C15.697 11.7725 15.1694 12.3155 15.1694 12.9853C15.1694 13.6552 15.697 14.1982 16.3478 14.1982C16.9986 14.1982 17.5261 13.6552 17.5261 12.9853C17.5261 12.3155 16.9986 11.7725 16.3478 11.7725ZM12.4543 2.40326C9.88885 2.40326 7.80912 4.47585 7.80912 7.03251C7.8267 7.13205 7.8267 7.23388 7.80912 7.33341H17.1576C17.1205 7.23734 17.1008 7.13545 17.0995 7.03251C17.0995 4.47585 15.0198 2.40326 12.4543 2.40326Z" />
  </svg>
);

export const RightArrow = (props: IconProps): JSX.Element => (
  <svg
    className={props.className}
    width="35"
    height="35"
    viewBox="0 0 35 35"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className={props.color}
      d="M10.0155 22.0797L18.5008 13.5945L21.3292 16.4229L12.844 24.9082L10.0155 22.0797Z"
      fill="#D7CDB9"
    />
    <path
      className={props.color}
      d="M11.418 11.5056H23.418L23.418 15.5056L11.418 15.5056L11.418 11.5056Z"
      fill="#D7CDB9"
    />
    <path
      className={props.color}
      d="M23.4181 23.5057L23.418 11.5056L19.4181 11.5057L19.4181 23.5057H23.4181Z"
      fill="#D7CDB9"
    />
  </svg>
);

export const ChevronRight = (props: IconProps): JSX.Element => (
  <svg
    className={props.className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className={props.color}
      d="M3.52344 10H15.5234V14H3.52344V10Z"
      fill="#3A3328"
    />
    <path
      className={props.color}
      d="M11.9922 3.51465L20.4775 11.9999L17.649 14.8284L9.16376 6.34308L11.9922 3.51465Z"
      fill="#3A3328"
    />
    <path
      className={props.color}
      d="M11.9922 20.4854L20.4775 11.9999L17.649 9.17164L9.16376 17.6569L11.9922 20.4854Z"
      fill="#3A3328"
    />
  </svg>
);

export const ChevronLeft = (props: IconProps): JSX.Element => (
  <svg
    className={props.className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className={props.color}
      d="M20.4775 10H8.47747V14H20.4775V10Z"
      fill="#3A3328"
    />
    <path
      className={props.color}
      d="M12.0087 3.51465L3.52344 11.9999L6.35186 14.8284L14.8371 6.34308L12.0087 3.51465Z"
      fill="#3A3328"
    />
    <path
      className={props.color}
      d="M12.0087 20.4854L3.52344 11.9999L6.35186 9.17164L14.8371 17.6569L12.0087 20.4854Z"
      fill="#3A3328"
    />
  </svg>
);
export const Google = (props: IconProps): JSX.Element => (
  <svg
    className={props.className}
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M40.32 24.3865C40.32 23.181 40.2118 22.0219 40.0109 20.9092H24V27.4851H33.1491C32.755 29.6101 31.5573 31.4106 29.7568 32.616V36.8815H35.2509C38.4655 33.9219 40.32 29.5637 40.32 24.3865Z"
      fill="#4285F4"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M24.0004 41C28.5904 41 32.4386 39.4777 35.2514 36.8814L29.7573 32.6159C28.235 33.6359 26.2877 34.2386 24.0004 34.2386C19.5727 34.2386 15.825 31.2482 14.4881 27.23H8.80859V31.6345C11.6059 37.1905 17.355 41 24.0004 41Z"
      fill="#34A853"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M14.4877 27.23C14.1477 26.21 13.9546 25.1205 13.9546 24C13.9546 22.8796 14.1477 21.79 14.4877 20.77V16.3655H8.80818C7.65682 18.6605 7 21.2568 7 24C7 26.7432 7.65682 29.3396 8.80818 31.6346L14.4877 27.23Z"
      fill="#FBBC05"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M24.0004 13.7614C26.4963 13.7614 28.7373 14.6191 30.4991 16.3037L35.375 11.4277C32.4309 8.68455 28.5827 7 24.0004 7C17.355 7 11.6059 10.8096 8.80859 16.3655L14.4881 20.77C15.825 16.7518 19.5727 13.7614 24.0004 13.7614Z"
      fill="#EA4335"
    />
  </svg>
);
