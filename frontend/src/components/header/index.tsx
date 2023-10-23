"use client";
import Link from "next/link";
import Logo from "../logo";
import { Cart, Catalog } from "../icons";
import { useAppSelector } from "@/hooks/useStore";
import { memo, useEffect, useState } from "react";
import { motion, useTransform, useScroll } from "framer-motion";
import cntl from "cntl";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { resetProduct } from "@/redux/actions/product";

const Header = memo((): JSX.Element => {
  const { user } = useAppSelector((state) => state.Auth);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [currentPosY, setCurrentPosY] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (val) => {
      setCurrentPosY(val);
    });

    return () => {
      unsubscribe();
    };
  }, [scrollY]);

  const backgroundColor = useTransform(
    scrollY,
    [0, 80],
    ["rgba(28,26,23,0.0)", "rgba(28,26,23,.8)"],
  );
  const height = useTransform(scrollY, [0, 80], ["100px", "50px"]);
  const textColor = useTransform(
    scrollY,
    [0, 80],
    [`${pathname === "/catalog" ? "#D7CDB9" : "#3A3328"}`, "#D7CDB9"],
  );

  const underlineCondition = cntl`
  ${currentPosY < 80 ? "after:bg-brown-300" : "after:bg-brown-200"}
  `;

  return (
    <motion.header
      className={`z-[999999] fixed w-screen h-[100px]  ${
        currentPosY < 80 ? "backdrop-blur-none" : "backdrop-blur-sm"
      }`}
      style={{
        backgroundColor,
        height,
      }}
      transition={{
        ease: [0.5, 1, 0.89, 1],
        type: "spring",
        stiffness: 1000,
        duration: 0.3,
      }}
    >
      <div className="flex items-center base-layout h-full ">
        <div className="flex justify-start basis-1/3">
          <Link
            href={"/catalog"}
            onClick={(): { payload: undefined; type: "product/resetProduct" } =>
              dispatch(resetProduct())
            }
            className="flex items-center group"
          >
            <Catalog
              className="md:group-hover:animate-spin-circle md:mr-2 fill-current"
              style={{
                color: textColor,
              }}
            />
            <motion.span
              className={`header-nav ${underlineCondition}`}
              style={{
                color: textColor,
              }}
            >
              Catalog
            </motion.span>
          </Link>
        </div>
        <div className="flex justify-center basis-1/3">
          <Link
            href={"/"}
            onClick={(): { payload: undefined; type: "product/resetProduct" } =>
              dispatch(resetProduct())
            }
          >
            <Logo
              className="w-[15vh]"
              style={{
                color: textColor,
              }}
            />
          </Link>
        </div>
        <div className="flex justify-end items-center basis-1/3">
          {user ? (
            <Link href={"/profile"} className="md:mr-20 lg:mr-24 xl:mr-28">
              <motion.span
                className={`header-nav ${underlineCondition}`}
                style={{ color: textColor }}
              >
                Profile
              </motion.span>
            </Link>
          ) : (
            <Link href={"/signup"} className="md:mr-20 lg:mr-24 xl:mr-28">
              <motion.span
                className={`header-nav ${underlineCondition}`}
                style={{ color: textColor }}
              >
                Sign in/up
              </motion.span>
            </Link>
          )}
          <Link href={"/cart"}>
            <Cart
              className=" fill-current h-5 w-5"
              style={{ color: textColor }}
            />
          </Link>
        </div>
      </div>
    </motion.header>
  );
});

Header.displayName = "Header";
export default Header;
