export default function ProcessInsights({ items }: { items: string[] }) {
  return (
    <ul className="flex max-w-[971px] flex-col gap-4">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 font-body text-[18px] font-medium leading-[1.6] tracking-[-0.18px] text-ink/50 md:text-[24px] md:tracking-[-0.24px]"
        >
          <span
            className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-ink/30"
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
