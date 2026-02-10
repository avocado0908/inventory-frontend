import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import type { BranchAssignments, Branch } from "@/types";
import { useList } from "@refinedev/core";
import { DataTableRowActions } from "@/components/table-row-action";
import { Badge } from "@/components/ui/badge";
import type { MonthlyInventory } from "@/types";

type BranchAssignmentTableProps = {
  onEdit: (assignment: BranchAssignments) => void;
  filters?: any[];
};

export function BranchAssingmentTable({ onEdit, filters = [] }: BranchAssignmentTableProps) {
  // ===== Data fetching =====
  const { query: branchesQuery } = useList<Branch>({
    resource: "branches",
    pagination: { pageSize: 100 },
  });
  const branches = branchesQuery.data?.data ?? [];

  const { query: inventoryQuery } = useList<MonthlyInventory>({
    resource: "monthly-inventory",
    pagination: { pageSize: 10000 },
  });
  const inventoryRows = inventoryQuery.data?.data ?? [];

  // ===== Map branch id -> name =====
  const branchNameById = useMemo(() => {
    const map = new Map<number, string>();
    branches.forEach((b) => map.set(b.id, b.name));
    return map;
  }, [branches]);

  const totalByAssignment = useMemo(() => {
    const map = new Map<number, number>();
    inventoryRows.forEach((row) => {
      const id = Number(row.branchAssignmentsId ?? (row as unknown as { branchAssignmentId?: number }).branchAssignmentId);
      if (!Number.isFinite(id)) return;
      const value = Number(row.stockValue ?? 0);
      map.set(id, (map.get(id) ?? 0) + value);
    });
    return map;
  }, [inventoryRows]);

  // ===== Table columns =====
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
        id:"status",
        accessorKey:'status',
        size: 120,
        header: () => <p className="column-title">Status</p>,
        cell: ({ getValue }) => {
          const status = String(getValue<string>() ?? "");
          const variant =
            status === "done" ? "secondary" : status === "in progress" ? "default" : "outline";
          return <Badge variant={variant}>{status || "—"}</Badge>;
        },
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
        id: "totalValue",
        header: () => <p className="column-title">Total Value</p>,
        size: 140,
        cell: ({ row }) => {
          const total = totalByAssignment.get(row.original.id) ?? 0;
          return <span className="text-foreground">${total.toFixed(2)}</span>;
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

  // ===== Render =====
  return <DataTable table={table} />;
}
