import type { ReactNode } from "react";

type SectionBlockProps = {
  children: ReactNode;
  title?: string;
  description?: string;
};

export function SectionBlock({
  children,
  title,
  description,
}: SectionBlockProps) {
  return (
    <section className="space-y-4">
      {title || description ? (
        <div className="space-y-1">
          {title ? (
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          ) : null}
          {description ? (
            <p className="text-sm leading-6 text-neutral-600">{description}</p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
