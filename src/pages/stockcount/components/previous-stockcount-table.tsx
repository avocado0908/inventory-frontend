import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import type { BranchAssignments } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

type PreviousStockcountTableProps = {
  currentMonth: string;
};

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function PreviousStockcountTable({ currentMonth }: PreviousStockcountTableProps) {
  const columns = useMemo<ColumnDef<BranchAssignments>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: () => <p className="column-title">Branch Assignment</p>,
        cell: ({ getValue }) => <span className="list-title font-semibold">{getValue<string>()}</span>,
      },
      {
        id: "status",
        accessorKey: "status",
        header: () => <p className="column-title">Status</p>,
        cell: ({ getValue }) => {
          const status = String(getValue<string>() ?? "");
          const variant =
            status === "done" ? "secondary" : status === "in progress" ? "default" : "outline";
          return (
            <span className="list-title">
              <Badge variant={variant}>{status || "—"}</Badge>
            </span>
          );
        },
      },
      {
        id: "createdAt",
        header: () => <p className="column-title">Created At</p>,
        cell: ({ row }) => (
          <span className="list-title text-gray-600">{formatDate(row.original.assignedAt)}</span>
        ),
      },
      {
        id: "updatedAt",
        accessorKey: "updatedAt",
        header: () => <p className="column-title">Updated At</p>,
        cell: ({ getValue }) => (
          <span className="list-title text-gray-600">
            {formatDate(getValue<string | undefined>())}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => (
          <div className="flex w-full justify-end">
            <p className="column-title">Action</p>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex w-full justify-end pr-2">
            <Button asChild size="sm">
              <Link to={`/stockcount-entry?branchAssignmentsId=${row.original.id}`}>Manage</Link>
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  const table = useTable<BranchAssignments>({
    columns,
    refineCoreProps: {
      resource: "branch-assignments",
      pagination: { pageSize: 10, mode: "server" },
      filters: {
        permanent: [
          {
            field: "excludeAssignedMonth",
            operator: "eq",
            value: currentMonth,
          },
        ],
      },
      sorters: { initial: [{ field: "assignedMonth", order: "desc" }] },
    },
  });

  return <DataTable table={table} />;
}
