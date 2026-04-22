type SidebarPlaceholderProps = {
  title: string;
  items: string[];
};

export function SidebarPlaceholder({ title, items }: SidebarPlaceholderProps) {
  return (
    <aside className="hidden min-h-dvh w-64 border-r border-border bg-surface px-4 py-5 lg:block">
      <div className="mb-8 text-sm font-semibold text-foreground">{title}</div>
      <nav className="space-y-1" aria-label={title}>
        {items.map((item) => (
          <div
            key={item}
            className="rounded-md px-3 py-2 text-sm font-medium text-neutral-600"
          >
            {item}
          </div>
        ))}
      </nav>
    </aside>
  );
}
