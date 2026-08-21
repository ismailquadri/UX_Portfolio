export default function ProseHtml({
  html,
  className = "",
}: {
  html: string;
  className?: string;
}) {
  return (
    <div
      className={`max-w-[971px] font-body text-[18px] font-medium leading-[1.6] tracking-[-0.18px] text-ink/50 md:text-[24px] md:tracking-[-0.24px] [&_a]:underline [&_strong]:font-semibold [&_strong]:text-ink ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
