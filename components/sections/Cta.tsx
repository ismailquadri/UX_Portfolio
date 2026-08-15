import Image from "next/image";

import SidebarSpacer from "@/components/SidebarSpacer";

export default function Cta() {
  return (
    <section className="flex w-full items-start justify-between overflow-clip rounded-b-lg bg-paper shadow-button">
      <SidebarSpacer />

      <div className="flex w-full flex-1 flex-col items-start px-6 py-14">
        <div className="relative flex w-full flex-1 flex-col items-start overflow-hidden rounded-md px-6 py-10 md:px-[90px]">
          <Image
            src="/images/cta-bg.jpg"
            alt=""
            aria-hidden="true"
            fill
            sizes="(min-width: 768px) 80vw, 100vw"
            className="object-cover"
          />

          <div className="relative flex w-full max-w-[544px] flex-col items-start justify-between gap-10 py-10">
            <div className="flex flex-col items-start gap-6">
              <h2 className="w-full max-w-[469px] font-heading text-[56px] leading-none tracking-[-0.56px] text-ink mix-blend-overlay">
                Let&rsquo;s Turn Your Idea Into a Product That Works.
              </h2>

              <a
                href="mailto:hello@mike.com"
                className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-sm border border-border-subtle bg-paper px-3 py-2 font-body text-[16px] tracking-[-0.16px] text-ink shadow-button"
              >
                Book 15 Mins Call
                <Image
                  src="/images/call-icon.png"
                  alt=""
                  width={17}
                  height={14}
                  className="h-[14px] w-[17px] object-cover"
                />
              </a>
            </div>

            <p className="w-full max-w-[452px] font-body text-[24px] leading-[1.6] tracking-[-0.24px] text-paper opacity-50">
              Whether it&rsquo;s your first MVP or a full redesign, I&rsquo;ll
              help you move from concept to launch with purpose and
              precision.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
