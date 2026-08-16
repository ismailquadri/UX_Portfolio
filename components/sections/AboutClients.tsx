import Image from "next/image";

import SidebarSpacer from "@/components/SidebarSpacer";

const CLIENTS = [
  { name: "Foxxie", logo: "/images/clients/foxxie.png" },
  { name: "Mogram", logo: "/images/clients/mogram.png" },
  { name: "Luniatic", logo: "/images/clients/luniatic.png" },
  { name: "Vindex", logo: "/images/clients/vindex.png" },
  { name: "Luminous", logo: "/images/clients/luminous.png" },
  { name: "Limbo", logo: "/images/clients/limbo.png" },
  { name: "Woxa", logo: "/images/clients/woxa.png" },
  { name: "Scheme", logo: "/images/clients/scheme.png" },
];

export default function AboutClients() {
  return (
    <section className="flex w-full items-start justify-between">
      <SidebarSpacer />

      <div className="flex w-full flex-1 flex-col items-start gap-12 py-14">
        <div className="flex w-full items-end justify-between px-6">
          <div className="relative flex items-center gap-2.5">
            <h2 className="relative font-heading text-[32px] leading-tight tracking-[-0.32px] text-ink md:text-[56px] md:leading-none md:tracking-[-0.56px]">
              <span className="relative z-10 block">
                <span className="absolute -left-2.5 top-1/2 -z-10 hidden h-[67px] w-[531px] -translate-y-1/2 rounded-full bg-gradient-to-r from-black/10 to-black/0 md:block" />
                Who I Work With
              </span>
            </h2>
          </div>
          <p className="hidden shrink-0 whitespace-nowrap font-body text-[18px] tracking-[-0.18px] text-ink md:block">
            [ CLIENT ]
          </p>
        </div>

        <div className="grid w-full grid-cols-2 px-6 md:grid-cols-4">
          {CLIENTS.map((client) => (
            <div
              key={client.name}
              className="relative flex h-[220px] flex-col items-center justify-center border border-border-subtle md:h-[317px]"
            >
              <div className="relative size-[80px] md:size-[120px]">
                <Image
                  src={client.logo}
                  alt={`${client.name} logo`}
                  fill
                  sizes="120px"
                  className="object-contain"
                />
              </div>
              <span className="absolute bottom-3 left-2 font-body text-[12px] tracking-[-0.12px] text-ink/50">
                {client.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
