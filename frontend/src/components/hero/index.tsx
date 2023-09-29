"use client";
import Image from "next/image";
import { useWindowDimensions } from "@/hooks/use-window-dimensions";
import { CircleDesign } from "../circle";
import { ProductInfo } from "../product-info";
import heroImage from "../../../public/images/hero.jpeg";
import { ChevronLeft, ChevronRight } from "../icons";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { ProductState } from "@/redux/slices/product";
import { useEffect } from "react";
import { getProductList } from "@/redux/actions/product";

const data = {
  title: "rolling hoodie god",
  price: 599,
  num: 3,
};

export function MobileHeroFooter(): JSX.Element {
  return (
    <div className="flex justify-between pb-10">
      <div className="flex items-end">
        <div className="mr-4">
          <button>
            <ChevronLeft />
          </button>
        </div>
        <div className="flex text-brown-300">
          <span className="text-brown-300 text-2xl text-border-white">01</span>/{" "}
          <span className="text-brown-300 text-border-white">03</span>
        </div>
      </div>
      <div>
        <button>
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}

export function HeroFooter(): JSX.Element {
  return (
    <div className="pb-10 lg:pb-28 flex-col z-[99999999] ">
      <div className="flex justify-between sm:flex-col">
        <div className="flex items-center justify-end sm:mb-8">
          <div className="flex md:pr-20 lg:pr-24 xl:pr-28">
            {Array.from({ length: data.num }, (_, index) => (
              <div
                key={index}
                className="w-[10px] h-[10px] bg-brown-300 rounded-full even:mx-3"
              ></div>
            ))}
          </div>
          <div className="ml-[5vw] lg:ml-[5px]">
            <button>
              <ChevronRight />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <div className="flex md:pr-20 lg:pr-24 xl:pr-28 text-brown-300">
            <span className="text-brown-300 text-2xl text-border-white">
              01
            </span>
            / <span className="text-brown-300 text-border-white">03</span>
          </div>
          <div className="ml-[5vw] lg:ml-[5px]">
            <button>
              <ChevronLeft />
            </button>
          </div>
        </div>
      </div>
      <div className="justify-end mt-24 hidden sm:flex">
        <div className="md:pr-20 lg:pr-24 xl:pr-28 flex-col ">
          <span className="uppercase block text-brown-300 text-3xl font-[200] text-border-white text-right">
            made with love
          </span>
          <span className="uppercase block text-brown-300 text-3xl font-[200] text-border-white text-right -my-2">
            unisex
          </span>
          <span className="uppercase block text-brown-300 text-3xl font-[200] text-border-white text-right">
            clothing
          </span>
        </div>
        <div className="ml-[5vw] lg:ml-[5px]">
          <span className="text-brown-300">&copy;</span>
        </div>
      </div>
    </div>
  );
}

export default function Hero(): JSX.Element {
  const { width } = useWindowDimensions();
  const titles = data.title.split(" ");

  //const loading = useAppSelector<LoadingState>((state) => state.Loading);
  const dispatch = useAppDispatch();
  const product = useAppSelector<ProductState>((state) => state.product);

  useEffect(() => {
    dispatch(
      getProductList({
        category: undefined,
        color: undefined,
        skip: 0,
        limit: 3,
        filter: undefined,
      }),
    );
  }, [dispatch]);

  console.log(product);

  return (
    <section className=" w-screen h-screen">
      <CircleDesign width={width} />
      {product.loading === "succeeded" ? (
        <div>
          <div className="w-full h-full relative">
            <Image
              src={heroImage}
              alt="product-image-1"
              layout="fill"
              style={{
                objectFit: "cover",
              }}
              property="true"
              quality={95}
            />
          </div>
          <div className="px-[22px] md:px-[44px] lg:px-[60px] xl:px-[96px] absolute top-0 left-0 w-screen h-screen flex flex-col justify-between">
            <ProductInfo titles={titles} price={data.price} width={width} />
            {width < 640 ? <MobileHeroFooter /> : <HeroFooter />}
          </div>
        </div>
      ) : (
        <div>loading...</div>
      )}
    </section>
  );
}
