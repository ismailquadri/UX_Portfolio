export default function Footer() {
  return (
    <footer className="flex w-full items-center justify-center bg-border-subtle px-6 py-8">
      <div className="flex w-full flex-1 flex-col items-start justify-center gap-20">
        <div className="tracking-[-0.32px]">
          <p className="font-body text-[32px] leading-[1.6] text-accent/50">
            A Product Designer Based in Lagos
          </p>
          <p className="font-body text-[32px] font-medium leading-[1.6] text-accent">
            Get in touch with me -{" "}
            <a href="mailto:hello@quadriismail.com">hello@quadriismail.com</a>
          </p>
        </div>
        <div className="flex w-full items-center justify-between text-ink">
          <p className="font-body text-[16px] leading-[1.4] tracking-[-0.16px]">
            © {new Date().getFullYear()} Quadri Ismail. All rights reserved.
          </p>
          <p className="font-body text-[16px] leading-[1.2]">
            Find me on{" "}
            {/* TODO: replace with real LinkedIn profile URL */}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-solid [text-underline-position:from-font]"
            >
              LinkedIn
            </a>{" "}
            or{" "}
            {/* TODO: replace with real Behance profile URL */}
            <a
              href="#"
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
