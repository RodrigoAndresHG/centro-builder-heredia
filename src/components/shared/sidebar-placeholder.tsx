import Link from "next/link";

type SidebarItem =
  | string
  | {
      label: string;
      href: string;
    };

type SidebarPlaceholderProps = {
  title: string;
  items: SidebarItem[];
};

export function SidebarPlaceholder({ title, items }: SidebarPlaceholderProps) {
  return (
    <aside className="hidden min-h-dvh w-64 border-r border-border bg-surface px-4 py-5 lg:block">
      <div className="mb-8 text-sm font-semibold text-foreground">{title}</div>
      <nav className="space-y-1" aria-label={title}>
        {items.map((item) => (
          typeof item === "string" ? (
            <div
              key={item}
              className="rounded-md px-3 py-2 text-sm font-medium text-neutral-600"
            >
              {item}
            </div>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-surface-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          )
        ))}
      </nav>
    </aside>
  );
}
