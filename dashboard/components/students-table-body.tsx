"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import type { StudentTableRowView } from "@/lib/api";

export function StudentsTableBody({ rows }: { rows: StudentTableRowView[] }) {
  const router = useRouter();
  return (
    <tbody>
      {rows.map((r) => (
        <tr
          key={r.key}
          role="button"
          tabIndex={0}
          onClick={() => router.push(`/students/${encodeURIComponent(r.key)}`)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              router.push(`/students/${encodeURIComponent(r.key)}`);
            }
          }}
          className="cursor-pointer border-t border-[var(--border)] transition-colors hover:bg-[rgba(8,151,53,0.07)]"
        >
          <td className="px-4 py-3 text-sm font-semibold text-[var(--foreground)]">
            {r.studentId}
          </td>
          <td className="px-4 py-3 text-sm text-[var(--foreground)]">{r.name}</td>
          <td className="max-w-[12rem] truncate px-4 py-3 text-sm text-[var(--muted-foreground)]">
            {r.email}
          </td>
          <td className="max-w-[10rem] truncate px-4 py-3 text-sm text-[var(--foreground)]">
            {r.program}
          </td>
          <td className="px-4 py-2">
            <Badge variant="secondary" className="text-[10px] font-semibold">
              {r.admissionType}
            </Badge>
          </td>
          <td className="px-4 py-2">
            <Badge variant="outline" className="text-[10px]">
              {r.status}
            </Badge>
          </td>
          <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">
            {r.phone}
          </td>
          <td className="whitespace-nowrap px-4 py-3 text-sm text-[var(--muted-foreground)]">
            {r.joinedAt}
          </td>
        </tr>
      ))}
    </tbody>
  );
}
