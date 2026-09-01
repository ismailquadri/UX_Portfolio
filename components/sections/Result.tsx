import Image from "next/image";
import { Link } from "next-view-transitions";

export default function Result() {
  return (
    <section
      id="result"
      className="flex w-full items-start justify-between"
    >
      <div className="flex w-full flex-1 flex-col items-start gap-12 py-14">
        <div className="flex w-full items-end justify-between px-6">
          <h2 className="w-full max-w-[971px] font-heading text-[32px] leading-tight tracking-[-0.32px] text-ink md:text-[56px] md:leading-none md:tracking-[-0.56px]">
            Every product starts as an idea, but not every idea becomes a{" "}
            <span className="relative inline">
              <span className="absolute -left-2.5 top-1/2 -z-10 hidden h-[52px] w-[150px] -translate-y-1/2 rounded-full bg-gradient-to-r from-black/10 to-black/0 md:block" />
              product.
            </span>{" "}
            <span className="text-ink/40">
              Through research, testing, and iteration, I help that idea find
              its form
            </span>
          </h2>
        </div>

        <div className="flex w-full flex-col items-center justify-center gap-8 px-6 py-10">
          <div className="flex w-full flex-col items-center gap-4 md:flex-row">
            <div className="relative h-[280px] w-full overflow-clip rounded-md border border-border-subtle bg-[rgba(245,245,245,0.2)] shadow-button md:h-[526px] md:flex-1">
              <Image
                src="/images/case-studies/ryno-finance/hero.png"
                alt="Ryno Finance case study preview"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
              <Link
                href="/case-studies/ryno-finance"
                className="absolute bottom-[29px] left-1/2 flex h-9 -translate-x-1/2 items-center justify-center gap-2 overflow-hidden rounded-sm border border-white/10 bg-white/20 px-3 py-2 font-body text-[14px] font-medium tracking-[-0.14px] text-paper backdrop-blur-sm"
              >
                See Study Case
              </Link>
            </div>

            <div className="relative h-[280px] w-full overflow-clip rounded-md bg-[#151317] shadow-button md:h-[526px] md:flex-1">
              <Image
                src="/images/result-tile-2.png"
                alt="Case study preview: logistics dashboard mockup"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
              <Link
                href="/case-studies/linqart"
                className="absolute bottom-[30px] left-1/2 flex h-9 -translate-x-1/2 items-center justify-center gap-2 overflow-hidden rounded-sm border border-white/10 bg-white/20 px-3 py-2 font-body text-[14px] font-medium tracking-[-0.14px] text-paper backdrop-blur-sm"
              >
                See Study Case
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <p className="whitespace-nowrap font-body text-[16px] tracking-[-0.16px] text-ink/30">
              Want to See more magic?
            </p>
            <div className="flex items-center gap-3">
              <a
                href="mailto:hello@quadriismail.com"
                className="flex h-9 shrink-0 items-center justify-center gap-2 rounded-sm border border-border-subtle bg-paper px-3 py-2 font-body text-[14px] font-medium tracking-[-0.14px] text-ink shadow-button"
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
              <Link
                href="/case-studies"
                className="flex h-9 shrink-0 items-center justify-center gap-2 rounded-sm border border-white bg-black px-3 py-2 font-body text-[14px] font-medium tracking-[-0.28px] text-paper shadow-[0px_6px_6px_-3px_rgba(0,0,0,0.25),0px_0px_0px_2px_rgba(0,0,0,0.15)]"
                style={{
                  backgroundImage:
                    "radial-gradient(ellipse 8.3px 3.6px at 50% 0%, rgba(255,255,255,0.3) 11.881%, rgba(255,255,255,0) 100%)",
                }}
              >
                See All Finished Product
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
