import Image from "next/image";

type PageSidebarLink = {
  label: string;
  href: string;
};

export default function PageSidebar({ links }: { links: PageSidebarLink[] }) {
  return (
    <div className="hidden md:flex h-full w-[269px] shrink-0 flex-col items-start justify-center overflow-clip border-r border-border-subtle bg-surface">
      <div className="flex w-full flex-col items-start justify-center gap-8 py-10 pl-10 pr-4">
        <span className="relative block size-[30px] shrink-0">
          <Image src="/images/hero-logo.svg" alt="" fill sizes="30px" />
        </span>
        <nav className="flex w-full flex-col items-start">
          {links.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              className={`relative flex w-full items-start gap-2.5 whitespace-nowrap p-2.5 font-body text-[16px] tracking-[-0.16px] text-ink ${
                index === 0 ? "font-medium" : "font-medium opacity-30"
              }`}
            >
              {link.label}
              {index === 0 && (
                <span className="absolute inset-x-0 bottom-0 h-px w-[213px] bg-border-subtle" />
              )}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
