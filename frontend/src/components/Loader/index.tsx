import "../../styles/loader.css";

export default function Loader(): JSX.Element {
  return (
    <div className="w-full h-full bg-brown-500/60  z-[999999]">
      <span className="loader"></span>
    </div>
  );
}
