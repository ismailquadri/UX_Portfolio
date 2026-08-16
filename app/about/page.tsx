import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageSidebar from "@/components/PageSidebar";
import ContactForm from "@/components/ContactForm";
import AboutIntro from "@/components/sections/AboutIntro";
import AboutApproach from "@/components/sections/AboutApproach";
import AboutSkills from "@/components/sections/AboutSkills";
import AboutClients from "@/components/sections/AboutClients";
import { RevealOnScroll } from "@/components/RevealOnScroll";

const ABOUT_LINKS = [
  { label: "About Me", href: "#intro" },
  { label: "Capability", href: "#approach" },
  { label: "Skills & Domains", href: "#skills" },
  { label: "Who I Work With", href: "#clients" },
  { label: "Send me Messages", href: "#contact" },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-paper">
      <Navbar />
      <main className="flex w-full flex-1">
        <PageSidebar links={ABOUT_LINKS} />
        <div className="flex w-full flex-1 flex-col">
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
