import Image from "next/image";
import HeroSidebar from "@/components/HeroSidebar";

export default function Hero() {
  return (
    <section className="flex w-full items-start justify-between">
      <HeroSidebar />

      <div className="flex w-full flex-1 flex-col items-end">
        <div className="flex h-[814px] w-full items-center justify-center overflow-clip px-6 py-3">
          <div className="relative h-full w-full overflow-clip rounded-lg bg-gradient-to-b from-[#efefef] to-[#898989]">
            <Image
              src="/images/hero-bg.png"
              alt="Illustrated garden landscape at sunrise"
              fill
              priority
              sizes="(min-width: 768px) 80vw, 100vw"
              className="object-cover"
            />

            <div
              id="chat"
              className="absolute left-1/2 top-[53px] flex h-[641px] w-[420px] -translate-x-1/2 items-center rounded-lg border border-paper bg-paper/40 p-3 shadow-lg backdrop-blur-md"
            >
              <p className="p-8 text-center text-muted">
                Chat widget placeholder
              </p>
            </div>

            <div className="absolute left-1/2 top-[714px] w-[337px] -translate-x-1/2 text-center font-body text-[16px] leading-[1.4] tracking-[-0.16px] text-paper">
              <p>
                You can send me a message via this popup with the tag{" "}
                <span className="rounded-[8px] border border-white/10 bg-white/20 px-1.5 py-0.5 text-[14px] tracking-[-0.14px] opacity-70">
                  @mike
                </span>{" "}
                or ask anything about my service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
