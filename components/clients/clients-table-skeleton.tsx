import { Skeleton } from "@/components/ui/skeleton";

export function ClientsTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="overflow-hidden">
      <table className="w-full" aria-label="Ładowanie klientów">
        <thead className="bg-muted/40">
          <tr className="border-border border-b">
            <th className="px-5 py-2.5">
              <Skeleton className="h-3 w-16" />
            </th>
            <th className="hidden px-4 py-2.5 md:table-cell">
              <Skeleton className="h-3 w-12" />
            </th>
            <th className="hidden px-4 py-2.5 lg:table-cell">
              <Skeleton className="h-3 w-16" />
            </th>
            <th className="px-4 py-2.5">
              <Skeleton className="h-3 w-14" />
            </th>
            <th className="hidden px-4 py-2.5 md:table-cell">
              <Skeleton className="h-3 w-14" />
            </th>
            <th className="w-[56px] px-3 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="border-border border-b last:border-0">
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-9 rounded-full" />
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <Skeleton className="h-3 w-40 max-w-full" />
                    <Skeleton className="h-2.5 w-24" />
                  </div>
                </div>
              </td>
              <td className="hidden px-4 py-3.5 md:table-cell">
                <Skeleton className="h-3 w-24" />
              </td>
              <td className="hidden px-4 py-3.5 lg:table-cell">
                <Skeleton className="h-3 w-32" />
              </td>
              <td className="px-4 py-3.5">
                <Skeleton className="h-5 w-20 rounded-full" />
              </td>
              <td className="hidden px-4 py-3.5 md:table-cell">
                <Skeleton className="h-3 w-16" />
              </td>
              <td className="w-[56px] px-3 py-3.5 text-right">
                <Skeleton className="inline-block size-7 rounded-md" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
