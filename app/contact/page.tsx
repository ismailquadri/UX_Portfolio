import Image from "next/image";
import Navbar from "@/components/Navbar";
import SiteSidebar from "@/components/SiteSidebar";
import ContactForm from "@/components/ContactForm";
import Faq from "@/components/sections/Faq";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Quadri Ismail",
  description:
    "Get in touch about UX audits, UI/UX design, or MVP product development.",
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-paper">
      <Navbar />
      <div className="flex w-full flex-1">
        <SiteSidebar />
        <main className="flex w-full flex-1 flex-col">
          <section className="flex w-full items-end justify-between gap-6 border-b border-border-subtle px-6 py-14">
            <h1 className="font-heading text-[32px] leading-tight tracking-[-0.32px] text-ink md:text-[56px] md:leading-[normal] md:tracking-[-0.56px]">
              Let&rsquo;s start a
              <br />
              conversation
            </h1>
            <p className="hidden whitespace-nowrap font-body text-[18px] font-medium tracking-[-0.18px] text-ink md:block">
              [ CONTACT ]
            </p>
          </section>

          <section id="message-form" className="flex w-full flex-col items-start gap-12 px-6 py-14">
            <div className="flex w-full flex-col gap-0.5">
              <p className="font-body text-[14px] tracking-[-0.14px] text-ink/50">
                GET IN TOUCH
              </p>
              <h2 className="font-heading text-[32px] leading-tight tracking-[-0.32px] text-ink md:text-[56px] md:leading-[normal] md:tracking-[-0.56px]">
                Send me a Message
              </h2>
            </div>

            <div className="flex w-full flex-col items-center gap-10 lg:flex-row lg:items-start">
              <div className="flex w-full flex-1 flex-col items-start gap-12">
                <ContactForm />

                <div className="flex w-full max-w-[576px] items-center justify-between border-t border-border-subtle pt-8">
                  <div className="flex flex-col gap-2">
                    <p className="font-body text-[16px] font-medium tracking-[-0.16px] text-ink/50">
                      Email
                    </p>
                    <p className="font-body text-[16px] leading-[1.4] tracking-[-0.16px] text-ink">
                      hello@quadriismail.com
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="font-body text-[16px] font-medium tracking-[-0.16px] text-ink/50">
                      Response time
                    </p>
                    <p className="font-body text-[16px] leading-[1.4] tracking-[-0.16px] text-ink">
                      24 hours
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative h-[320px] w-full shrink-0 overflow-hidden rounded-2xl sm:h-[420px] lg:h-[518px] lg:w-[507px]">
                <Image
                  src="/images/contact-portrait.png"
                  alt="Portrait of Quadri, available for new projects"
                  fill
                  sizes="(min-width: 1024px) 507px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </section>

          <Faq />
        </main>
      </div>
      <Footer />
    </div>
  );
}
