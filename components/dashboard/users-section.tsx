"use client";

import * as React from "react";
import { useQueryStates } from "nuqs";
import { SearchX } from "lucide-react";
import { usersParsers } from "@/lib/users-params";
import { UsersTable } from "./users-table";
import { Pagination } from "./pagination";
import { cn } from "@/lib/utils";
import type { QueryResult, SortKey } from "@/lib/query";

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-16 text-center">
      <SearchX className="text-muted-foreground size-8" />
      <p className="font-medium">No users match your filters</p>
      <p className="text-muted-foreground text-sm">
        Try a different search term or clear the filters in the header.
      </p>
    </div>
  );
}

export function UsersSection({ result }: { result: QueryResult }) {
  const [isPending, startTransition] = React.useTransition();
  const [params, setParams] = useQueryStates(usersParsers, {
    shallow: false,
    startTransition,
  });

  // Three-state cycle per column: initial -> desc -> asc -> initial.
  const onSort = (key: SortKey) => {
    if (params.sort !== key) {
      setParams({ sort: key, order: "desc", page: 1 });
    } else if (params.order === "desc") {
      setParams({ order: "asc" });
    } else {
      setParams({ sort: null, order: null, page: 1 });
    }
  };

  if (result.total === 0) return <EmptyState />;

  return (
    <div
      className={cn(
        "space-y-4 transition-opacity",
        isPending && "pointer-events-none opacity-60",
      )}
    >
      <UsersTable
        rows={result.rows}
        sort={params.sort}
        order={params.order ?? "asc"}
        onSort={onSort}
      />

      <Pagination
        page={result.page}
        pageCount={result.pageCount}
        pageSize={result.pageSize}
        total={result.total}
        onPage={(page) => setParams({ page })}
        onPageSize={(size) => setParams({ pageSize: size, page: 1 })}
      />
    </div>
  );
}
