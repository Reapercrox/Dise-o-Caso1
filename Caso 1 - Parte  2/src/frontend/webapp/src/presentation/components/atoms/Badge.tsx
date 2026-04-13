import type { ReactNode } from "react";

type Props = { variant: "green" | "yellow" | "red"; children: ReactNode };

export function Badge({ variant, children }: Props) {
  const cls = variant === "green" ? "badge-green" : variant === "yellow" ? "badge-yellow" : "badge-red";
  return <span className={`badge ${cls}`}>{children}</span>;
}
