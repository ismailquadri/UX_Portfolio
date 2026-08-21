import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import AiFluencyCallout from "@/components/sections/AiFluencyCallout";
import Capabilities from "@/components/sections/Capabilities";
import DomainStrip from "@/components/sections/DomainStrip";
import Process from "@/components/sections/Process";
import Result from "@/components/sections/Result";
import TechStack from "@/components/sections/TechStack";
import WaysToWork from "@/components/sections/WaysToWork";
import Faq from "@/components/sections/Faq";
import Cta from "@/components/sections/Cta";
import Footer from "@/components/Footer";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import SiteSidebar from "@/components/SiteSidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-paper">
      <Navbar />
      <div className="flex w-full flex-1">
        <SiteSidebar />
        <main className="flex w-full flex-1 flex-col">
          <Hero />
          <RevealOnScroll>
            <AiFluencyCallout />
          </RevealOnScroll>
          <RevealOnScroll>
            <Capabilities />
          </RevealOnScroll>
          <RevealOnScroll>
            <DomainStrip />
          </RevealOnScroll>
          <RevealOnScroll>
            <Process />
          </RevealOnScroll>
          <RevealOnScroll>
            <Result />
          </RevealOnScroll>
          <RevealOnScroll>
            <TechStack />
          </RevealOnScroll>
          <RevealOnScroll>
            <WaysToWork />
          </RevealOnScroll>
          <RevealOnScroll>
            <Faq />
          </RevealOnScroll>
          <RevealOnScroll>
            <Cta />
          </RevealOnScroll>
        </main>
      </div>
      <Footer />
    </div>
  );
}
