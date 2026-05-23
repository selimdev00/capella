import { SiteHeader } from "@/components/site-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserLoading() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
        <Skeleton className="h-8 w-40" />
        <div className="flex items-center gap-4">
          <Skeleton className="size-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </main>
    </>
  );
}
