import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import type { Uom } from "@/types";
import { DataTableRowActions } from "../../../components/table-row-action";

type UomTableProps = {
  onEdit: (uom: Uom) => void;
  filters?: any[];
};

export function UomTable({ onEdit, filters = [] }: UomTableProps) {
  // ===== Table columns =====
  const columns = useMemo<ColumnDef<Uom>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        size: 200,
        header: () => <p className="column-title">Name</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">{getValue<string>()}</span>
        ),
        filterFn: "includesString",
      },
      {
        id: "description",
        accessorKey: "description",
        size: 260,
        header: () => <p className="column-title">Description</p>,
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">
            {getValue<string | null | undefined>() || "—"}
          </span>
        ),
      },
      {
        id: "actions",
        size: 100,
        header: () => <p className="column-title">Actions</p>,
        cell: ({ row }) => (
          <DataTableRowActions
            record={row.original}
            resource="uom"
            onEdit={onEdit}
          />
        ),
      },
    ],
    [onEdit]
  );

  const table = useTable<Uom>({
    columns,
    refineCoreProps: {
      resource: "uom",
      pagination: { pageSize: 10, mode: "server" },
      filters: { permanent: filters },
      sorters: { initial: [{ field: "id", order: "desc" }] },
    },
  });

  // ===== Render =====
  return <DataTable table={table} />;
}
