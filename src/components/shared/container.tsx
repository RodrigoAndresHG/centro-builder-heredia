import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  size?: "default" | "wide";
};

export function Container({
  children,
  className = "",
  size = "default",
}: ContainerProps) {
  const maxWidth = size === "wide" ? "max-w-7xl" : "max-w-5xl";

  return (
    <div className={`mx-auto w-full ${maxWidth} px-5 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
