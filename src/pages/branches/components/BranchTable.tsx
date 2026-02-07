import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import type { Branch } from "@/types";
import { DataTableRowActions } from "../../../components/table-row-action";


type BranchTable = {
  onEdit: (branch: Branch) => void;
  filters?: any[];
};

export function BranchTable({ onEdit, filters = [] }: BranchTable) {
  const branchColumns = useMemo<ColumnDef<Branch>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        size: 300,
        header: () => <p className="column-title">Name</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">{getValue<string>()}</span>
        ),
        filterFn: "includesString",
      },
      {
        id: "actions",
        size: 100,
        header: () => <p className="column-title">Actions</p>,
        cell: ({ row }) => (
          <DataTableRowActions
            record={row.original}
            resource="branches"
            onEdit={onEdit} 
          />
        ),
      },
    ],
    [onEdit]
  );

  const branchTable = useTable<Branch>({
    columns: branchColumns,
    refineCoreProps: {
      resource: "branches",
      pagination: { pageSize: 10, mode: "server" },
      filters: { permanent: filters },
      sorters: { initial: [{ field: "id", order: "desc" }] },
    },
  });

  return <DataTable table={branchTable} />;
}
