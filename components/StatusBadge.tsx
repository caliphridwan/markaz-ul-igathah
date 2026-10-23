import { statusStyles } from "@/lib/format";

export function StatusBadge({ status }: { status: string }) {
  return <span className={`badge ${statusStyles[status] ?? "bg-sand text-ink ring-sand-dark"}`}>{status.toLowerCase()}</span>;
}
