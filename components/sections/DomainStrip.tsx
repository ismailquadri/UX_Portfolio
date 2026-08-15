const DOMAINS = ["FinTech", "AI-native", "GovTech", "Enterprise SaaS"];

export default function DomainStrip() {
  return (
    <section className="flex w-full flex-col items-center justify-center gap-4 bg-paper py-6">
      <p className="font-body text-[12px] font-medium tracking-[2px] text-muted">
        [ DOMAINS ]
      </p>
      <div className="flex flex-wrap items-start justify-center gap-3">
        {DOMAINS.map((domain) => (
          <div
            key={domain}
            className="rounded-[20px] border border-accent px-4 py-2"
          >
            <p className="whitespace-nowrap font-body text-[14px] text-accent">
              {domain}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
