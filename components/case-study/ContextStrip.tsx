type ContextStripProps = {
  category: string;
  role?: string;
  team?: string;
  client?: string;
  duration?: string;
  location?: string;
  liveUrl?: string;
};

export default function ContextStrip({
  category,
  role,
  team,
  client,
  duration,
  location,
  liveUrl,
}: ContextStripProps) {
  const rows: { label: string; value?: string }[] = [
    { label: "Role", value: role },
    { label: "Team", value: team },
    { label: "Client", value: client },
    { label: "Duration", value: duration },
    { label: "Location", value: location },
    { label: "Category", value: category },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3">
        {rows
          .filter((row) => row.value)
          .map((row) => (
            <div
              key={row.label}
              className="flex flex-col gap-1.5 border-t border-border-subtle pt-4"
            >
              <span className="font-body text-[12px] font-medium uppercase tracking-[0.06em] text-ink/40">
                {row.label}
              </span>
              <span className="font-body text-[16px] tracking-[-0.16px] text-ink md:text-[18px]">
                {row.value}
              </span>
            </div>
          ))}
      </div>
      {liveUrl && (
        <a
          href={liveUrl}
          className="inline-flex w-fit items-center justify-center gap-2 rounded-sm border border-paper bg-ink px-3 py-2 font-body text-[14px] font-medium tracking-[-0.14px] text-paper shadow-button"
        >
          Live Website
        </a>
      )}
    </div>
  );
}
