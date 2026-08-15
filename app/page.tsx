import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import AiFluencyCallout from "@/components/sections/AiFluencyCallout";
import Capabilities from "@/components/sections/Capabilities";
import DomainStrip from "@/components/sections/DomainStrip";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-paper">
      <Navbar />
      <main className="flex w-full flex-1 flex-col">
        <Hero />
        <AiFluencyCallout />
        <Capabilities />
        <DomainStrip />
      </main>
    </div>
  );
}
