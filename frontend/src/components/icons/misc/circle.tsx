type Size = "sm" | "lg";

interface CircleProps {
  size: Size;
  className: string;
}

export const Circle = (props: CircleProps): JSX.Element => {
  return props.size === "sm" ? (
    <svg
      className={props.className}
      width="143"
      height="347"
      viewBox="0 0 143 347"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="-139.5"
        cy="64.5"
        r="281.5"
        stroke="#3A3328"
        strokeWidth="0.5"
      />
    </svg>
  ) : (
    <svg
      className={props.className}
      width="593"
      height="604"
      viewBox="0 0 593 604"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="168" cy="179" r="424" stroke="#3A3328" strokeWidth="0.5" />
    </svg>
  );
};
