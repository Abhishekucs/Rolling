interface IDesktopSelectContainerProps {
  colorOptions: { label: string; value: string }[];
  filterOptions: { label: string; value: string }[];
}

export default function DesktopSelectContainer(
  props: IDesktopSelectContainerProps,
): JSX.Element {
  return (
    <div className="flex justify-between items-center max-lg:hidden py-5">
      <DesktopSelect title="Color" options={props.colorOptions} />
      <DesktopSelect title="Sort" options={props.filterOptions} />
    </div>
  );
}

function DesktopSelect({
  title,
  options,
}: {
  title: string;
  options: { label: string; value: string }[];
}): JSX.Element {
  return (
    <div className="flex gap-x-2">
      <span className="text-brown-200/60 captilize font-[100] after:content-[':'] ">
        {title}
      </span>
      <div>
        {options.map((val, index) => (
          <button
            className="even:px-2"
            key={index}
            onClick={(): void => console.log(val)}
          >
            <span className="text-brown-200 font-[200] capitalize ">
              {val.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
