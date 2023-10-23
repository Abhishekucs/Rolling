import { About } from "@/components/about";
import Hero from "@/components/hero";

export default function Home(): JSX.Element {
  return (
    <main className="">
      <Hero />
      <About />
    </main>
  );
}
