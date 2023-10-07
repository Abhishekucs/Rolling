"use client";
import Link from "next/link";
import Logo from "../logo";
import { Cart, Catalog } from "../icons";
import { useAppSelector } from "@/hooks/useStore";
import { memo } from "react";

/* TODO: Add color props to change the color of icon when scrolling */

const Header = memo((): JSX.Element => {
  const { user } = useAppSelector((state) => state.Auth);
  console.log(user);
  return (
    <header className="z-[999999] fixed w-screen">
      <div className="grid grid-cols-3 items-center mx-[22px] md:mx-[44px] lg:mx-[60px] xl:mx-[96px] py-10 grid-flow-row-dense">
        <div className="flex justify-start group">
          <Link href={"/catalog"} className="flex items-center">
            <Catalog
              className="md:group-hover:animate-spin-circle md:mr-2"
              color="text-brown-300 fill-current"
            />
            <span className="header-nav text-border-white">Catalog</span>
          </Link>
        </div>
        <div className="flex justify-center">
          <Link href={"/"}>
            <Logo className="w-[15vh]" color="text-brown-300 fill-current" />
          </Link>
        </div>
        <div className="flex justify-end items-center">
          {user ? (
            <Link href={"/profile"} className="md:mr-20 lg:mr-24 xl:mr-28">
              <span className="header-nav text-border-white ">Profile</span>
            </Link>
          ) : (
            <Link href={"/signup"} className="md:mr-20 lg:mr-24 xl:mr-28">
              <span className="header-nav text-border-white ">Sign in/up</span>
            </Link>
          )}
          <Link href={"/cart"}>
            <Cart className="text-brown-300 fill-current h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
});

Header.displayName = "Header";
export default Header;
