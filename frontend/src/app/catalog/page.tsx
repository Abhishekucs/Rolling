"use client";
import DesktopSelectContainer from "@/components/DesktopSelect";
import Loader from "@/components/Loader";
import CustomSelect from "@/components/Select";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { getProductList, resetProduct } from "@/redux/actions/product";
import { addToast } from "@/redux/actions/toast";
import { setCategory } from "@/redux/slices/category";
import cntl from "cntl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { SingleValue } from "react-select";

const categories = ["t-shirt", "hoodie"];
const ColorOptions = [
  { value: "black", label: "black" },
  { value: "white", label: "white" },
  { value: "red", label: "red" },
  { value: "yellow", label: "yellow" },
];

const FilterOptions = [
  { value: "instock", label: "instock" },
  { value: "expensive", label: "expensive" },
  { value: "cheap", label: "cheap" },
  { value: "new", label: "new" },
  { value: "old", label: "old" },
];

const selectedCategory = ({
  category,
  selected,
}: {
  category: string;
  selected: string;
}): string => cntl`
	${
    category === selected
      ? "text-brown-200 tracking-tight "
      : "text-brown-500 text-shadow tracking-tight hover:text-brown-300/50 hover:text-shadow-none"
  }
`;

const Catalog = (): JSX.Element => {
  const [selectedColorValue, setSelectedColorValue] = useState<
    string | undefined
  >();
  const [selectedSortValue, setSelectedSortValue] = useState<string>("instock");

  function handleColorSelect(
    val: SingleValue<{
      value: string;
      label: string;
    }>,
  ): void {
    setSelectedColorValue(val?.value);
  }
  function handleSortSelect(
    val: SingleValue<{
      value: string;
      label: string;
    }>,
  ): void {
    setSelectedSortValue(val?.value as string);
  }

  console.log(`Color: ${selectedColorValue}`);
  console.log(`Sort: ${selectedSortValue}`);

  const { loading, products, errorMessage } = useAppSelector(
    (state) => state.product,
  );
  const { currentCategory } = useAppSelector((state) => state.category);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      getProductList({
        category: currentCategory,
        filter: "instock",
        limit: 10,
      }),
    ).unwrap();
  }, [dispatch, currentCategory]);

  useEffect(() => {
    if (loading === "failed") {
      dispatch(
        addToast({
          error: true,
          message: errorMessage as string,
          createdAt: Date.now(),
        }),
      );
    }
  }, [loading, dispatch, errorMessage]);

  return (
    <section className="relative w-screen bg-brown-500 base-layout">
      {loading !== "succeeded" ? (
        loading === "failed" ? null : (
          <Loader />
        )
      ) : (
        <>
          <Categories />
          <div className="h-px bg-brown-200/50 w-full" />
          <CustomSelect
            handleColorSelect={handleColorSelect}
            handleSortSelect={handleSortSelect}
            colorOptions={ColorOptions}
            filterOptions={FilterOptions}
          />
          <DesktopSelectContainer
            colorOptions={ColorOptions}
            filterOptions={FilterOptions}
          />
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative py-10">
            {products.map((product, index) => (
              <div className="max-w-full h-[600px] relative" key={index}>
                <Image
                  src={product.variants.images[0]}
                  alt={product.name}
                  fill
                  priority
                  quality={100}
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

function Categories(): JSX.Element {
  const dispatch = useAppDispatch();
  const { currentCategory } = useAppSelector((state) => state.category);

  const currentSelected = currentCategory.toLowerCase().trim();

  function handleCategroyClick(val: string): void {
    dispatch(setCategory(val));
  }

  return (
    <div className="pt-[100px] pb-5 md:pb-16">
      <div className="flex gap-x-5 md:gap-x-10">
        {categories.map((category, index) => (
          <div key={index}>
            <button
              className={`font-[400] text-3xl md:text-7xl uppercase`}
              onClick={(): void => {
                handleCategroyClick(category);
                dispatch(resetProduct());
                dispatch(
                  getProductList({
                    category: category,
                  }),
                );
              }}
            >
              <span
                className={`${selectedCategory({
                  category,
                  selected: currentSelected,
                })} transition`}
              >
                {category}
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Catalog;
