import DesktopController from "@/components/Controllers/Desktop";
import { ChevronLeft, ChevronRight } from "@/components/icons";

export function MobileHeroFooter({
  onRightClick,
  onLeftClick,
  length,
  currentIndex,
}: {
  onRightClick: () => void;
  onLeftClick: () => void;
  length: number;
  currentIndex: number;
}): JSX.Element {
  return (
    <div className="flex justify-between pb-10">
      <div className="flex items-end">
        <div className="mr-4">
          <button onClick={onLeftClick}>
            <ChevronLeft />
          </button>
        </div>
        <div className="flex text-brown-300">
          <span className="text-brown-300 text-2xl text-border-white">
            {`0${currentIndex + 1}`}
          </span>
          /{" "}
          <span className="text-brown-300 text-border-white">{`0${length}`}</span>
        </div>
      </div>
      <div className="z-[9999999]">
        <button onClick={onRightClick}>
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}

export function HeroFooter({
  onRightClick,
  onLeftClick,
  length,
  currentIndex,
}: {
  onRightClick: () => void;
  onLeftClick: () => void;
  length: number;
  currentIndex: number;
}): JSX.Element {
  return (
    <div className="flex flex-col justify-end">
      <div className="pb-10 lg:pb-28 flex-col">
        <DesktopController
          currentIndex={currentIndex}
          onLeftClick={onLeftClick}
          onRightClick={onRightClick}
          length={length}
        />
        <DesktopTagLine />
      </div>
    </div>
  );
}

export function DesktopTagLine(): JSX.Element {
  return (
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
  );
}
