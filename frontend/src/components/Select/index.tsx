import cntl from "cntl";
import Select, { ActionMeta, SingleValue } from "react-select";

interface ISelectProps {
  handleColorSelect: (
    val: SingleValue<{
      value: string;
      label: string;
    }>,
  ) => void;
  handleSortSelect: (
    val: SingleValue<{
      value: string;
      label: string;
    }>,
  ) => void;
  colorOptions: { value: string; label: string }[];
  filterOptions: { value: string; label: string }[];
}

export default function CustomSelect(props: ISelectProps): JSX.Element {
  return (
    <div className="flex justify-between gap-x-4 py-5 lg:hidden">
      <ReactSelect
        title="Color"
        handleSelect={props.handleColorSelect}
        options={props.colorOptions}
      />
      <ReactSelect
        title="Sort"
        defaultValue={{
          label: "instock",
          value: "instock",
        }}
        handleSelect={props.handleSortSelect}
        options={props.filterOptions}
      />
    </div>
  );
}

function ReactSelect({
  handleSelect,
  options,
  title,
  defaultValue,
}: {
  defaultValue?: {
    value: string;
    label: string;
  };
  title: string;
  handleSelect: (
    newValue: SingleValue<{
      value: string;
      label: string;
    }>,
    actionMeta: ActionMeta<{
      value: string;
      label: string;
    }>,
  ) => void;
  options: Array<{ value: string; label: string }>;
}): JSX.Element {
  return (
    <div className="flex basis-1/2 flex-col lg:flex-row lg:items-center gap-x-2">
      <span className="text-brown-200/60 captilize font-[100] after:content-[':'] ">
        {title}
      </span>
      <Select
        onChange={handleSelect}
        options={options}
        defaultValue={defaultValue}
        unstyled
        isClearable
        styles={{
          input: (base) => ({
            ...base,
            "input:focus": {
              boxShadow: "none",
            },
          }),
          dropdownIndicator: () => ({
            display: "none",
          }),
          indicatorsContainer: () => ({
            display: `${title.toLowerCase() === "sort" ? "none" : "block"}`,
          }),
        }}
        classNames={{
          control: (_) => cntl`border-b-[1px] border-brown-200/50 cursor-none}`,
          input: (_) => cntl`text-brown-200 `,
          placeholder: (_) => "text-brown-200/60 font-[200]",
          menu: (_) =>
            "bg-brown-500 text-brown-200 font-[200] capitalize border border-brown-300/90",
          option: (state) =>
            cntl`p-2 ${
              state.isFocused
                ? "text-brown-500 bg-brown-200/50"
                : "text-brown-200"
            }`,
          valueContainer: (_) => cntl`text-brown-200 font-[200]`,
          clearIndicator: (_) => cntl`text-brown-200 p-1 cursor-pointer`,
        }}
      />
    </div>
  );
}
