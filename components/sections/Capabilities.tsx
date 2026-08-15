import SidebarSpacer from "@/components/SidebarSpacer";

const SERVICES = [
  {
    title: "UX Audit",
    description:
      "Identify what's holding your product back. I analyze usability, flow, and interaction patterns to uncover friction points and turn them into opportunities for better user experience.",
  },
  {
    title: "User Segmentation & Insights",
    description:
      "Define who your users truly are. I help you develop clear user segments and behavioral insights to make every design decision data-driven and human-centered.",
  },
  {
    title: "UI/UX Design & Prototyping",
    description:
      "From concept to clickable prototype — I design interfaces that don't just look good but feel intuitive, efficient, and on-brand.",
  },
  {
    title: "MVP Product Development",
    description:
      "Turn your idea into a working product fast. I help you design, build, and launch your MVP with just the right features to validate your vision and attract early users.",
  },
];

export default function Capabilities() {
  return (
    <section id="capabilities" className="flex w-full items-start justify-between">
      <SidebarSpacer />

      <div className="flex w-full flex-1 flex-col items-start gap-12 py-14">
        <div className="flex w-full items-end justify-between px-6">
          <div className="relative flex flex-1 items-center gap-2.5">
            <h2 className="relative w-full max-w-[640px] font-heading text-[56px] leading-none tracking-[-0.56px] text-ink md:w-[640px]">
              <span className="block">I don&rsquo;t bring dreams,</span>
              <span className="relative z-10 block">
                <span className="absolute -left-2.5 top-1/2 -z-10 h-[67px] w-full -translate-y-1/2 rounded-full bg-gradient-to-r from-black/10 to-black/0" />
                I bring solutions for your Business
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

          {/* TODO: placeholder for decorative graphic (Figma composite image mock-UI panel) */}
          <div
            aria-hidden="true"
            className="hidden flex-1 self-stretch overflow-hidden rounded-lg border border-border-subtle bg-[rgba(245,245,245,0.2)] shadow-button lg:block"
          />
        </div>
      </div>
    </section>
  );
}
