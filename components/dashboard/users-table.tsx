"use client";

import * as React from "react";
import Link from "next/link";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  ChevronsUpDown,
  SlidersHorizontal,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RoleDot } from "@/components/users/role-badge";
import { fullName, initials, titleCase } from "@/lib/format";
import type { User } from "@/lib/types";
import type { SortKey, SortOrder } from "@/lib/query";

interface UsersTableProps {
  rows: User[];
  sort: SortKey | null;
  order: SortOrder;
  onSort: (key: SortKey) => void;
}

export function UsersTable({ rows, sort, order, onSort }: UsersTableProps) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const columns = React.useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: "name",
        header: "User",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <Link
              href={`/users/${user.id}`}
              className="group/name focus-visible:ring-ring flex items-center gap-3 rounded-sm focus-visible:ring-2 focus-visible:outline-none"
            >
              <Avatar className="size-9">
                <AvatarImage src={user.image} alt="" />
                <AvatarFallback>{initials(user)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="flex items-center gap-1 font-medium">
                  <span className="truncate group-hover/name:underline">
                    {fullName(user)}
                  </span>
                  <ArrowUpRight className="text-muted-foreground size-3.5 shrink-0 opacity-0 transition-opacity group-hover/name:opacity-100" />
                </p>
                <p className="text-muted-foreground truncate text-sm">
                  {user.email}
                </p>
              </div>
            </Link>
          );
        },
      },
      {
        id: "role",
        header: "Role",
        cell: ({ row }) => <RoleDot role={row.original.role} />,
      },
      {
        id: "age",
        header: "Age",
        cell: ({ row }) => (
          <span className="font-mono tabular-nums">{row.original.age}</span>
        ),
      },
      {
        id: "gender",
        header: "Gender",
        cell: ({ row }) => titleCase(row.original.gender),
      },
      {
        id: "company",
        header: "Company",
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="truncate">{row.original.company.name}</p>
            <p className="text-muted-foreground truncate text-sm">
              {row.original.company.title}
            </p>
          </div>
        ),
      },
      {
        id: "city",
        header: "Location",
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="truncate">{row.original.address.city}</p>
            <p className="text-muted-foreground truncate text-sm">
              {row.original.address.country}
            </p>
          </div>
        ),
      },
      {
        id: "actions",
        header: "",
        enableHiding: false,
        cell: ({ row }) => (
          <div className="text-right">
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Open ${fullName(row.original)}`}
              render={<Link href={`/users/${row.original.id}`} />}
            >
              <ArrowUpRight className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table manages its own memoization
  const table = useReactTable({
    data: rows,
    columns,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
  });

  // Columns the URL drives sorting for (must be a SortKey).
  const SORTABLE = new Set<string>([
    "name",
    "age",
    "email",
    "company",
    "city",
    "role",
    "gender",
  ]);

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
            <SlidersHorizontal className="size-4" />
            Columns
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              {table
                .getAllColumns()
                .filter((c) => c.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table className="min-w-[680px]">
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => {
                  const id = header.column.id;
                  const sortable = SORTABLE.has(id);
                  const active = sort === id;
                  const label = flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  );
                  return (
                    <TableHead
                      key={header.id}
                      className="text-muted-foreground text-xs font-medium tracking-wide uppercase"
                      aria-sort={
                        active
                          ? order === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                      }
                    >
                      {sortable ? (
                        <button
                          type="button"
                          onClick={() => onSort(id as SortKey)}
                          className="text-foreground focus-visible:ring-ring -ml-1 inline-flex items-center gap-1 rounded-sm px-1 font-medium focus-visible:ring-2 focus-visible:outline-none"
                        >
                          {label}
                          {active ? (
                            order === "asc" ? (
                              <ArrowUp className="size-3.5" />
                            ) : (
                              <ArrowDown className="size-3.5" />
                            )
                          ) : (
                            <ChevronsUpDown className="text-muted-foreground size-3.5" />
                          )}
                        </button>
                      ) : (
                        label
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
