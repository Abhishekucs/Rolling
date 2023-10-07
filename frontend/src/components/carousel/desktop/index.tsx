import Image from "next/image";
import { memo } from "react";

interface IDesktopCarouselProps {
  imageData: string[];
  currentIndex: number;
}

const DesktopCarousel = memo(
  ({ imageData, currentIndex }: IDesktopCarouselProps): JSX.Element => {
    return (
      <div className="relative h-full w-full">
        <div className="h-full w-full overflow-hidden">
          <div
            className="flex w-full h-full transition duration-500"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {imageData.map((data, index) => {
              return (
                <div key={index} className="w-full h-full shrink-0 relative">
                  <Image
                    src={data}
                    alt={`${index}`}
                    fill
                    sizes="100vw"
                    style={{
                      objectFit: "cover",
                    }}
                    priority
                    quality={100}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
);

DesktopCarousel.displayName = "DesktopCarousel";
export default DesktopCarousel;
