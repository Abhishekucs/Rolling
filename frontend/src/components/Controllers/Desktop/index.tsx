import { ChevronLeft, ChevronRight } from "@/components/icons";
import cntl from "cntl";
import { motion } from "framer-motion";
import { memo } from "react";

const active = cntl`
	w-[10px]
	h-[10px]
`;
const inactive = cntl`
	w-[5px]
	h-[5px]
`;

interface DesktopControllerProps {
  currentIndex: number;
  onRightClick: () => void;
  onLeftClick: () => void;
  length: number;
}

const DesktopController = memo(
  ({
    currentIndex,
    onLeftClick,
    onRightClick,
    length,
  }: DesktopControllerProps): JSX.Element => {
    return (
      <div className="flex justify-between sm:flex-col">
        <div className="flex items-center justify-end sm:mb-8">
          <div className="flex md:pr-20 lg:pr-24 xl:pr-28 items-center">
            {Array.from({ length: length }, (_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9 }}
                animate={{
                  scale: index === currentIndex ? 1.2 : 0.9, // Scale up the current index and scale down others
                }}
                transition={{ duration: 0.2 }}
                className={` bg-brown-300 rounded-full even:mx-3 div-border-white ${
                  index === currentIndex ? active : inactive
                }`}
              ></motion.div>
            ))}
          </div>
          <div className="ml-[5vw] lg:ml-[5px]">
            <button onClick={onRightClick}>
              <ChevronRight />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <div className="flex md:pr-20 lg:pr-24 xl:pr-28 text-brown-300">
            <span className="text-brown-300 text-2xl text-border-white">
              {`0${currentIndex + 1}`}
            </span>
            /{" "}
            <span className="text-brown-300 text-border-white">{`0${length}`}</span>
          </div>
          <div className="ml-[5vw] lg:ml-[5px]">
            <button onClick={onLeftClick}>
              <ChevronLeft />
            </button>
          </div>
        </div>
      </div>
    );
  },
);

DesktopController.displayName = "DesktopController";
export default DesktopController;
