import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import WritingPreview from "@/components/sections/WritingPreview";
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
        <main id="main-content" className="flex w-full flex-1 flex-col">
          <Hero />
          <DomainStrip />
          <RevealOnScroll><Result /></RevealOnScroll>
          <RevealOnScroll><Capabilities /></RevealOnScroll>
          <RevealOnScroll><Process /></RevealOnScroll>
          <RevealOnScroll><WaysToWork /></RevealOnScroll>
          <RevealOnScroll><TechStack /></RevealOnScroll>
          <RevealOnScroll><WritingPreview /></RevealOnScroll>
          <RevealOnScroll><Faq /></RevealOnScroll>
          <RevealOnScroll><Cta /></RevealOnScroll>
        </main>
      </div>
      <Footer />
    </div>
  );
}
