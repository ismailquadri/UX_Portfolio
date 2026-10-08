import Image from "next/image";

const SERVICES = [
  {
    title: "Product Discovery & UX Audits",
    description:
      "Find where people get stuck and why. I review key journeys, product constraints, and available evidence, then help the team decide what to improve first.",
  },
  {
    title: "Research & User Insights",
    description:
      "Understand the people behind the workflow—their goals, context, and decisions—so the product responds to real needs instead of assumptions.",
  },
  {
    title: "Product Design & Prototyping",
    description:
      "Turn the problem into clear flows, considered interactions, and prototypes the team can review before implementation.",
  },
  {
    title: "MVP Definition & Design",
    description:
      "Decide what the first useful release needs to do, then shape an experience that helps the team test its most important assumptions.",
  },
];

export default function Capabilities() {
  return (
    <section id="capabilities" className="flex w-full items-start justify-between">
      <div className="flex w-full flex-1 flex-col items-start gap-12 py-14">
        <div className="flex w-full items-end justify-between px-6">
          <div className="relative flex flex-1 items-center gap-2.5">
            <h2 className="relative w-full max-w-[640px] font-heading text-[56px] leading-none tracking-[-0.56px] text-ink md:w-[640px]">
              <span className="block">Complex products need</span>
              <span className="relative z-10 block">
                <span className="absolute -left-2.5 top-1/2 -z-10 h-[67px] w-full -translate-y-1/2 rounded-full bg-gradient-to-r from-black/10 to-black/0" />
                clear, considered design.
              </span>
            </h2>
          </div>
          <p className="hidden shrink-0 whitespace-nowrap font-body text-[18px] tracking-[-0.18px] text-ink md:block">
            [ CAPABILITIES ]
          </p>
        </div>

        <div className="flex w-full items-center px-6 py-10">
          <div className="flex w-full max-w-[539px] flex-col items-start justify-center pr-4">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="flex w-full flex-col items-start gap-2 border-b border-border-subtle py-6"
              >
                <h3 className="font-body text-[16px] font-medium tracking-[-0.16px] text-ink">
                  {service.title}
                </h3>
                <p className="font-body text-[16px] leading-[1.4] tracking-[-0.16px] text-muted">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          <div
            aria-hidden="true"
            className="relative hidden flex-1 self-stretch overflow-hidden rounded-md border border-border-subtle bg-[rgba(245,245,245,0.2)] shadow-button lg:block"
          >
            <Image
              src="/images/capabilities-graphic.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 45vw, 0px"
              className="object-cover object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
