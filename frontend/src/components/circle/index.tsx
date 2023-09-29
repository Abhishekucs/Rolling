import { Circle } from "../icons/misc/circle";

export const CircleDesign = ({ width }: { width: number }): JSX.Element => {
  return (
    <>
      <div
        className={`absolute top-0 z-[9999999] opacity-50 ${
          width >= 768
            ? width >= 1024
              ? "-translate-x-[50px] -translate-y-[50px]"
              : "-translate-x-[280px] -translate-y-[100px]"
            : "md:left-[300px]"
        }  `}
      >
        <Circle
          size={width >= 768 ? "lg" : "sm"}
          className={width >= 768 ? "" : "w-[200px]"}
        />
      </div>
      <div
        className={`absolute bottom-0 right-0 circle z-[9999999] opacity-50 ${
          width >= 768
            ? width >= 1024
              ? "translate-x-[100px] translate-y-[100px]"
              : "-right-1/4"
            : "md:right-[300px]"
        }  `}
      >
        <Circle
          size={width >= 768 ? "lg" : "sm"}
          className={width >= 768 ? "" : "w-[200px]"}
        />
      </div>
    </>
  );
};
