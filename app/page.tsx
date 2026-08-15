import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-paper">
      <Navbar />
      <main className="flex w-full flex-1 flex-col">
        <Hero />
      </main>
    </div>
  );
}
