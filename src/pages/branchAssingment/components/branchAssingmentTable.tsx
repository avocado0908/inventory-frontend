import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import type { BranchAssignments, Branch } from "@/types";
import { useList } from "@refinedev/core";
import { DataTableRowActions } from "@/components/table-row-action";

type BranchAssignmentTableProps = {
  onEdit: (assignment: BranchAssignments) => void;
  filters?: any[];
};

export function BranchAssingmentTable({ onEdit, filters = [] }: BranchAssignmentTableProps) {
  const { query: branchesQuery } = useList<Branch>({
    resource: "branches",
    pagination: { pageSize: 100 },
  });
  const branches = branchesQuery.data?.data ?? [];

  const branchNameById = useMemo(() => {
    const map = new Map<number, string>();
    branches.forEach((b) => map.set(b.id, b.name));
    return map;
  }, [branches]);

  const columns = useMemo<ColumnDef<BranchAssignments>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        size: 220,
        header: () => <p className="column-title">Name</p>,
        cell: ({ getValue }) => <span className="text-foreground">{getValue<string>()}</span>,
        filterFn: "includesString",
      },
      {
        id: "branchId",
        accessorKey: "branchId",
        size: 160,
        header: () => <p className="column-title">Branch</p>,
        cell: ({ getValue }) => {
          const id = getValue<number>();
          return <span className="text-foreground">{branchNameById.get(id) ?? "—"}</span>;
        },
      },
      {
        id: "assignedMonth",
        accessorKey: "assignedMonth",
        size: 120,
        header: () => <p className="column-title">Month</p>,
        cell: ({ getValue }) => {
          const value = getValue<string>();
          return <span className="text-foreground">{value ? value.slice(0, 7) : "—"}</span>;
        },
      },
      {
        id: "actions",
        size: 100,
        header: () => <p className="column-title">Actions</p>,
        cell: ({ row }) => (
          <DataTableRowActions
            record={row.original}
            resource="branch-assignments"
            onEdit={onEdit}
          />
        ),
      },
    ],
    [onEdit, branchNameById]
  );

  const table = useTable<BranchAssignments>({
    columns,
    refineCoreProps: {
      resource: "branch-assignments",
      pagination: { pageSize: 10, mode: "server" },
      filters: { permanent: filters },
      sorters: { initial: [{ field: "id", order: "desc" }] },
    },
  });

  return <DataTable table={table} />;
}
