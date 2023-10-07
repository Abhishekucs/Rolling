import Image from "next/image";
import { PanInfo, motion, useMotionValue, useSpring } from "framer-motion";
import { memo, useRef, useState } from "react";
import cntl from "cntl";

interface IProductCarouselProps {
  images: string[];
  className?: string;
}

const DRAG_THRESHOLD = 150;
const FALLBACK_WIDTH = 1024;

const active = cntl`
	w-[10px]
	h-[10px]
`;
const inactive = cntl`
	w-[5px]
	h-[5px]
`;

const MobileCarousel = memo((props: IProductCarouselProps): JSX.Element => {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const canScrollPrev = currentIndex > 0;
  const canScrollNext = currentIndex < props.images.length - 1;

  const offsetX = useMotionValue(0);
  const animatedX = useSpring(offsetX, {
    damping: 20,
    stiffness: 150,
  });

  function handleDragSnap(
    _: MouseEvent,
    { offset: { x: dragOffset } }: PanInfo,
  ): void {
    //reset drag state

    //stop drag animation (rest velocity)
    animatedX.stop();

    const currentOffset = offsetX.get();

    //snap back if not dragged far enough or if at the start/end of the list
    if (
      Math.abs(dragOffset) < DRAG_THRESHOLD ||
      (!canScrollPrev && dragOffset > 0) ||
      (!canScrollNext && dragOffset < 0)
    ) {
      animatedX.set(currentOffset);
      return;
    }

    let offsetWidth = 0;
    /*
      - start searching from currently active slide in the direction of the drag
      - check if the drag offset is greater than the width of the current item
      - if it is, add/subtract the width of the next/prev item to the offsetWidth
      - if it isn't, snap to the next/prev item
    */
    for (
      let i = currentIndex;
      dragOffset > 0 ? i >= 0 : i < itemsRef.current.length;
      dragOffset > 0 ? i-- : i++
    ) {
      const item = itemsRef.current[i];
      if (item === null) continue;
      const itemOffset = item.offsetWidth;

      const prevItemWidth =
        itemsRef.current[i - 1]?.offsetWidth ?? FALLBACK_WIDTH;
      const nextItemWidth =
        itemsRef.current[i + 1]?.offsetWidth ?? FALLBACK_WIDTH;

      if (
        (dragOffset > 0 && //dragging left
          dragOffset > offsetWidth + itemOffset && //dragged past item
          i > 1) || //not the first/second item
        (dragOffset < 0 && //dragging right
          dragOffset < offsetWidth + -itemOffset && //dragged past item
          i < itemsRef.current.length - 2) //not the last/second to last item
      ) {
        dragOffset > 0
          ? (offsetWidth += prevItemWidth)
          : (offsetWidth -= nextItemWidth);
        continue;
      }

      if (dragOffset > 0) {
        //prev
        offsetX.set(currentOffset + offsetWidth + prevItemWidth);
        setCurrentIndex(i - 1);
      } else {
        //next
        offsetX.set(currentOffset + offsetWidth - nextItemWidth);
        setCurrentIndex(i + 1);
      }
      break;
    }
  }

  const cicleIndicators = Array.from(
    { length: props.images.length },
    (_, index) => (
      <motion.div
        key={index}
        initial={{ scale: 1 }}
        animate={{
          scale: index === currentIndex ? 1.2 : 1, // Scale up the current index and scale down others
        }}
        transition={{ duration: 0.2 }}
        className={` bg-brown-300 rounded-full even:mx-3 div-border-white ${
          index === currentIndex ? active : inactive
        }`}
      ></motion.div>
    ),
  );
  return (
    <div className={`w-full h-[550px] relative ${props.className}`}>
      <div className={`w-full h-full relative overflow-hidden`}>
        <div className="flex w-full h-full">
          {props.images.map((image, index) => {
            return (
              <motion.div
                key={index}
                className={`w-full h-full shrink-0 relative`}
                style={{
                  x: animatedX,
                }}
                drag="x"
                dragConstraints={{
                  left: -(FALLBACK_WIDTH * (props.images.length - 1)),
                  right: FALLBACK_WIDTH,
                }}
                onDragEnd={handleDragSnap}
              >
                <motion.div
                  transition={{
                    ease: "easeInOut",
                    duration: 0.4,
                  }}
                  ref={(el): HTMLDivElement | null =>
                    (itemsRef.current[index] = el)
                  }
                  className="w-full h-full relative"
                >
                  <Image
                    src={image}
                    alt={`${index}`}
                    fill
                    sizes="100vw"
                    style={{
                      objectFit: "cover",
                    }}
                    priority
                    quality={100}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <div className="-mt-[30px] relative">
        <div className="flex items-center justify-center">
          {cicleIndicators}
        </div>
      </div>
    </div>
  );
});

MobileCarousel.displayName = "MobileCarousel";
export default MobileCarousel;
