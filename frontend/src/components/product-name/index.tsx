interface IProductNameProps {
  titles: string[];
  className?: string;
}

export default function ProductName(props: IProductNameProps): JSX.Element {
  return (
    <div className={props.className}>
      {props.titles.map((title, index) => {
        return (
          <h1
            key={index}
            className={`uppercase text-brown-300 font-[300] text-border-white text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl leading-1 sm:first:ml-14 md:first:ml-20 lg:first:ml-24 2xl:first:ml-32 ${
              index === props.titles.length - 1
                ? "sm:ml-7 md:ml-7 lg:ml-10 2xl:ml-20"
                : "ml-0"
            }  mb-4 sm:mb-0`}
          >
            {index === props.titles.length - 1 ? `"${title}"` : title}
          </h1>
        );
      })}
    </div>
  );
}
