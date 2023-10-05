import Loader from "@/components/Loader";

export default function Loading(): JSX.Element {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <Loader />
    </div>
  );
}
