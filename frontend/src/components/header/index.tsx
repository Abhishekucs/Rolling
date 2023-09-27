import Link from "next/link";
import Logo from "../logo";
import { Cart, Catalog } from "../icons";

/* TODO: Add color props to change the color of icon when scrolling */

export default function Header(): JSX.Element {
  return (
    <header className="z-[99999] backdrop-blur fixed w-screen">
      <div className="grid grid-cols-3 mx-[22px] md:mx-[96px] my-6 md:my-7 grid-flow-row-dense">
        <div className="flex justify-start">
          <Link href={"/signup"} className="flex items-center">
            <Catalog color="text-brown-500 fill-current" />
            <span className=" md:visible invisible md:font-bold ml-[8px]">
              Catalog
            </span>
          </Link>
        </div>
        <div className="flex justify-center">
          <Logo className="h-6 md:h-4" color="text-brown-500 fill-current" />
        </div>
        <div className="flex justify-end">
          <Link href={"/signup"} className="flex items-center">
            <Cart color="text-brown-500 fill-current" />
            <span className="invisible md:visible order-first">
              SignUp/SignIn
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
