import type { SearchParams } from "nuqs/server";
import { getAllUsers } from "@/lib/api/users";
import { loadUsersSearchParams, toUserQuery } from "@/lib/search-params";
import { computeStats, filterUsers, sortAndPaginate } from "@/lib/query";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeaderFilters } from "@/components/dashboard/header-filters";
import { StatCards } from "@/components/dashboard/stat-cards";
import { DashboardCharts } from "@/components/dashboard/charts";
import { UsersSection } from "@/components/dashboard/users-section";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const parsed = await loadUsersSearchParams(searchParams);
  const query = toUserQuery(parsed);

  const users = await getAllUsers();
  // Stats, charts and table all derive from one filtered set, so the whole
  // dashboard moves together with the active filters.
  const filtered = filterUsers(users, query);
  const stats = computeStats(filtered);
  const result = sortAndPaginate(filtered, query);

  return (
    <>
      <SiteHeader filters={<HeaderFilters />} />
      <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8">
        <div className="reveal space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Users dashboard
          </h1>
          <p className="text-muted-foreground">
            Browse, search, filter and sort {users.length} users. The overview
            and table follow your filters; the URL keeps any view shareable.
          </p>
        </div>

        <div className="reveal" style={{ animationDelay: "0.07s" }}>
          <StatCards stats={stats} />
        </div>
        <div className="reveal" style={{ animationDelay: "0.14s" }}>
          <DashboardCharts stats={stats} />
        </div>
        <div className="reveal" style={{ animationDelay: "0.21s" }}>
          <UsersSection result={result} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
