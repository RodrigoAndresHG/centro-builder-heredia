import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-border bg-surface p-5 shadow-sm shadow-neutral-950/5 ${className}`}
    >
      {children}
    </div>
  );
}
