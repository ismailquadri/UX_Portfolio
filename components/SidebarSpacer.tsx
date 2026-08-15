type SidebarSpacerProps = {
  className?: string;
};

/**
 * Decorative left-rail spacer shared across marketing sections.
 * Renders an empty bordered column on md+ viewports; hidden on mobile.
 */
export default function SidebarSpacer({ className }: SidebarSpacerProps) {
  return (
    <div
      aria-hidden="true"
      className={`hidden w-[269px] shrink-0 self-stretch border-r border-border-subtle bg-surface md:block${
        className ? ` ${className}` : ""
      }`}
    />
  );
}
