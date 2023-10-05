import Image from "next/image";

interface IDesktopCarouselProps {
  imageData: {
    image: string;
    name: string;
  }[];
  currentIndex: number;
}

export default function DesktopCarousel({
  imageData,

  currentIndex,
}: IDesktopCarouselProps): JSX.Element {
  return (
    <div className="relative">
      <div className="h-screen w-screen overflow-hidden">
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
                  src={data.image}
                  alt={data.name}
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
}
