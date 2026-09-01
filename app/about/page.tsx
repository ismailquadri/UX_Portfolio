import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteSidebar from "@/components/SiteSidebar";
import ContactForm from "@/components/ContactForm";
import AboutIntro from "@/components/sections/AboutIntro";
import AboutApproach from "@/components/sections/AboutApproach";
import AboutSkills from "@/components/sections/AboutSkills";
import AboutClients from "@/components/sections/AboutClients";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Quadri Ismail",
  description:
    "Product designer focused on complex, high-stakes products — my approach, skills, and the clients I've worked with.",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-paper">
      <Navbar />
      <div className="flex w-full flex-1">
        <SiteSidebar />
        <main className="flex w-full flex-1 flex-col">
          <div id="intro">
            <AboutIntro />
          </div>
          <RevealOnScroll>
            <div id="approach">
              <AboutApproach />
            </div>
          </RevealOnScroll>
          <RevealOnScroll>
            <div id="skills">
              <AboutSkills />
            </div>
          </RevealOnScroll>
          <RevealOnScroll>
            <div id="clients">
              <AboutClients />
            </div>
          </RevealOnScroll>
          <RevealOnScroll>
            <div id="contact" className="flex flex-col gap-6 px-6 py-16 md:px-20">
              <h2 className="font-heading text-[32px] text-ink md:text-[56px]">
                Send me a Message
              </h2>
              <ContactForm />
            </div>
          </RevealOnScroll>
        </main>
      </div>
      <Footer />
    </div>
  );
}
