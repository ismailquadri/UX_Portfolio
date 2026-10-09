import Image from "next/image";
import { Link } from "next-view-transitions";
import { ArrowRightIcon, ArrowTopRightIcon } from "@radix-ui/react-icons";
import { getCaseStudyBySlug } from "@/lib/case-studies";

export default function Result() {
  const work = [
    { slug: "ryno-finance", name: "Ryno Finance", image: "/images/case-studies/ryno-finance/hero.png" },
    { slug: "linqart", name: "Linqart", image: "/images/result-tile-2.png" },
  ];
  return <section id="result" className="section-pad scroll-mt-24 border-t border-border-subtle">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Selected work</p><h2 className="section-title mt-3">The work behind the words.</h2></div><Link href="/case-studies" className="inline-flex items-center gap-2 text-sm underline-offset-4 hover:underline">All case studies <ArrowRightIcon aria-hidden="true" /></Link></div>
    <div className="grid gap-10 lg:grid-cols-2">{work.map(item => {
      const study = getCaseStudyBySlug(item.slug);
      return <Link key={item.slug} href={`/case-studies/${item.slug}`} className="group block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#edf0ef]"><Image src={item.image} alt={`${item.name} product interface`} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.025]" /><span className="absolute bottom-4 right-4 flex size-11 items-center justify-center rounded-full bg-paper text-ink shadow-button"><ArrowTopRightIcon className="size-5" aria-hidden="true" /></span></div>
        <div className="mt-5 flex items-center justify-between gap-3"><h3 className="text-xl font-medium">{item.name}</h3><span className="rounded-full border border-border-subtle px-3 py-1 text-xs text-muted">{study?.category}</span></div>
        <p className="mt-2 max-w-[480px] text-base leading-relaxed text-muted">{study?.summary}</p>
        <span className="mt-4 inline-block text-sm underline decoration-ink/30 underline-offset-4 group-hover:decoration-ink">View case study</span>
      </Link>;
    })}</div>
  </section>;
}
