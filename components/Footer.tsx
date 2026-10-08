export default function Footer() {
  return (
    <footer className="flex w-full items-center justify-center bg-border-subtle px-6 py-8">
      <div className="flex w-full flex-1 flex-col items-start justify-center gap-20">
        <div className="tracking-[-0.32px]">
          <p className="font-body text-[32px] leading-[1.6] text-accent/50">
            Product designer based in Lagos, Nigeria
          </p>
          <p className="font-body text-[32px] font-medium leading-[1.6] text-accent">
            Let&rsquo;s talk about the role or product work ahead.{" "}
            <a href="mailto:hello@quadriismail.com">hello@quadriismail.com</a>
          </p>
        </div>
        <div className="flex w-full items-center justify-between text-ink">
          <p className="font-body text-[16px] leading-[1.4] tracking-[-0.16px]">
            © {new Date().getFullYear()} Quadri Ismail. All rights reserved.
          </p>
          <p className="font-body text-[16px] leading-[1.2]">
            Find me on{" "}
            <a
              href="https://ng.linkedin.com/in/quadriismail"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-solid [text-underline-position:from-font]"
            >
              LinkedIn
            </a>{" "}
            or{" "}
            <a
              href="https://www.behance.net/quadriismail"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-solid [text-underline-position:from-font]"
            >
              Behance
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
