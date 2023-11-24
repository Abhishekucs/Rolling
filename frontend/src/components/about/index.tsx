"use client";
import Image from "next/image";
import FemaleModel from "../../../public/images/FemaleModel.png";
import { Instagram, RightArrow } from "../icons";
import Link from "next/link";
import CircleButton from "../circle-button";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { resetProduct } from "@/redux/actions/product";
import { useWindowDimensions } from "@/hooks/use-window-dimensions";

export function About(): JSX.Element {
  const router = useRouter();
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();

  function handleButtonClick(): void {
    dispatch(resetProduct());
    router.push("/catalog");
  }

  return (
    <section className="base-layout bg-brown-100">
      <div className="pt-10 lg:pt-32 flex flex-col lg:flex-row lg:gap-12">
        <div className="flex flex-col basis-1/5 lg:mt-[8rem]">
          <span className="uppercase text-border-white ml-2 font-[200] lg:ml-14">
            est 2023
          </span>
          <span className="uppercase text-border-white font-[200] text-[28px] leading-8 lg:text-5xl">
            about -
          </span>
          <span className="uppercase text-border-white ml-10 font-[200] text-[28px] leading-8 lg:text-5xl lg:ml-16">
            rolling
          </span>
        </div>
        <div className="flex flex-col justify-end relative min-h-[513px]  grow">
          <Image
            className="absolute bottom-0 block z-10 max-sm:object-cover object-contain"
            src={FemaleModel}
            alt="femaleModel"
            fill
            quality={100}
          />
          <div className="absolute bottom-0 left-0 h-4/5 bg-light-brown w-full" />
        </div>
        <div className="py-10 basis-1/5 flex flex-col gap-20">
          <div className="hidden lg:block">
            <Link href={"https://www.instagram.com/rollingcloth/"}>
              <Instagram />
            </Link>
          </div>
          <div>
            <strong className="text-brown-300 font-[400] text-2xl text-border-white">
              WHO WE ARE
            </strong>
            <p className="font-[100] text-base text-brown-300 pt-4">
              Empowering Individuals, Preserving the Planet <br /> <br /> At{" "}
              <strong>ROLLING</strong>, our vision is to be a catalyst for
              positive change in the fashion industry. We envision a world where
              individuals express their unique styles effortlessly, adorned in
              streetwear that not only feels natural and comfortable but also
              reflects a commitment to sustainability. We strive to redefine the
              fashion narrative by seamlessly blending style, comfort, and
              eco-consciousness, making responsible choices the new standard in
              streetwear.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col py-10 lg:py-16">
        <div className="flex flex-col">
          <div>
            <span className="text-3xl font-[200]  text-brown-300 text-border-white sm:text-5xl md:text-7xl lg:text-8xl">
              MADE WITH LOVE
            </span>
          </div>
          <div className="flex justify-center ">
            <span className="text-3xl ml-[4rem] md:ml-[10rem] text-shadow-300 font-[200] text-brown-100 text-border-white sm:text-5xl md:text-7xl lg:text-8xl">
              UNISEX
            </span>
          </div>
          <div className="flex justify-end -mt-1">
            <span className="text-3xl font-[200] text-brown-300 text-border-white sm:text-5xl md:text-7xl lg:text-8xl">
              CLOTHING
            </span>
          </div>
        </div>
        <div className="flex justify-center">
          <CircleButton
            className="mt-8"
            textPosition="left"
            text={{
              first: "Shop",
              last: "Now",
            }}
            show
            size={width !== undefined && width > 1024 ? "lg" : "sm"}
            handleClick={handleButtonClick}
          >
            <RightArrow />
          </CircleButton>
        </div>
      </div>
    </section>
  );
}
