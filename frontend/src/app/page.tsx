import { About } from "@/components/about";
import Hero from "@/components/hero";
import { Strip } from "@/components/strip";

export default function Home(): JSX.Element {
  return (
    <main className="">
      <Hero />
      <Strip />
      <About />
    </main>
  );
}
