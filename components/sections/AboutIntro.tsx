import Image from "next/image";

import SidebarSpacer from "@/components/SidebarSpacer";

export default function AboutIntro() {
  return (
    <section className="flex w-full items-start justify-between">
      <SidebarSpacer />

      <div className="flex w-full flex-1 flex-col items-start gap-12 py-14">
        <div className="flex w-full items-end justify-between border-b border-border-subtle px-6 pb-8">
          <h1 className="relative font-heading text-[32px] leading-tight tracking-[-0.32px] text-ink md:text-[56px] md:leading-none md:tracking-[-0.56px]">
            <span className="relative z-10">
              <span className="absolute -left-2.5 top-1/2 -z-10 hidden h-[67px] w-[349px] -translate-y-1/2 rounded-full bg-gradient-to-r from-black/10 to-black/0 md:block" />
              About Me
            </span>
          </h1>
          <p className="hidden shrink-0 whitespace-nowrap font-body text-[18px] tracking-[-0.18px] text-ink md:block">
            [ ABOUT ME ]
          </p>
        </div>

        <div className="flex w-full items-center px-6">
          <div className="relative h-[400px] w-full overflow-hidden rounded-md shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04),0px_1px_0px_0px_rgba(0,0,0,0.06)] md:h-[573px]">
            <Image
              src="/images/about-intro-photo.png"
              alt="Portrait of the designer"
              fill
              sizes="(min-width: 768px) 1123px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="flex w-full flex-col gap-5 px-6">
          <p className="font-body text-[14px] tracking-[-0.28px] text-[#999]">
            WHO I AM
          </p>
          <div className="relative w-full">
            <span className="absolute -left-2.5 top-[46%] -z-10 hidden h-[67px] w-[500px] -translate-y-1/2 rounded-full bg-gradient-to-r from-black/10 to-black/0 md:block" />
            <p className="relative font-heading text-[24px] leading-normal tracking-[-0.24px] text-ink md:text-[48px] md:tracking-[-0.48px]">
              I&rsquo;m a product designer focused on turning complex ideas
              into clear, usable, and scalable digital experiences.
              <br />
              <br />
              <span className="text-ink/50">
                With a strong focus on B2B products, I help teams move from
                uncertainty to clarity — whether that means fixing usability
                issues, defining user flows, or designing interfaces that
                actually perform in real-world scenarios.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
