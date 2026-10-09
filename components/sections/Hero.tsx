import Image from "next/image";
import { Link } from "next-view-transitions";
import { ArrowDownIcon, ArrowTopRightIcon } from "@radix-ui/react-icons";
import OpenChatButton from "@/components/OpenChatButton";

export default function Hero() {
  return <section className="hero-section section-pad">
    <div className="max-w-[740px]">
      <p className="eyebrow">Quadri Ismail / Product designer / Lagos</p>
      <h1 className="mt-6 max-w-[680px] font-heading text-[clamp(2.8rem,5.2vw,5rem)] leading-[1.04] tracking-[-0.035em]">Complex products.<br /><span className="text-accent/65">Clearer ways to work.</span></h1>
      <p className="mt-6 max-w-[520px] text-lg leading-relaxed text-muted">I design the workflows people rely on to get things done. My work spans FinTech, AI-native products, GovTech, and enterprise SaaS.</p>
      <div className="mt-8 flex flex-wrap items-center gap-3"><a href="#result" className="button-primary">Explore my work <ArrowDownIcon aria-hidden="true" /></a><OpenChatButton /></div>
      <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-border-subtle pt-5 text-sm text-muted"><span>Full-time, contract &amp; fractional roles</span><Link href="/about" className="inline-flex items-center gap-1 text-ink underline-offset-4 hover:underline">A little about me <ArrowTopRightIcon aria-hidden="true" /></Link></div>
    </div>
    <div className="hero-portrait">
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-[100px] rounded-b-2xl bg-surface"><Image src="/images/contact-portrait.png" alt="Quadri Ismail" fill priority sizes="(min-width: 1280px) 260px, 0px" className="object-cover" /></div>
      <p className="mt-4 text-sm text-muted">Curious about the decisions behind the screens? Ask my portfolio assistant.</p>
    </div>
  </section>;
}
