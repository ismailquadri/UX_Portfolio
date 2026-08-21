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
    <div className="flex flex-col gap-3.5">
      {rows
        .filter((row) => row.value)
        .map((row) => (
          <div
            key={row.label}
            className="flex items-center gap-2 border-b border-border-subtle pb-3.5 font-body text-[16px] tracking-[-0.16px]"
          >
            <span className="font-medium text-ink">{row.label}:</span>
            <span className="text-ink/50">{row.value}</span>
          </div>
        ))}
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
