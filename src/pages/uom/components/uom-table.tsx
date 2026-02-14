import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import type { Uom } from "@/types";
import { DataTableRowActions } from "../../../components/table-row-action";
import { Ruler } from "lucide-react";

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
        size: 150,
        header: () => <p className="column-title">Name</p>,
        cell: ({ getValue }) => (
          <div className="flex items-center gap-3 list-title">
            <div className="p-2 bg-secondary rounded-lg">
              <Ruler className="lucide lucide-package w-4 h-4 text-primary" />
            </div>
            <span className="font-bold">{getValue<string>()}</span>
          </div>
        ),
        filterFn: "includesString",
      },
      {
        id: "description",
        accessorKey: "description",
        size: 300,
        header: () => <p className="column-title">Description</p>,
        cell: ({ getValue }) => (
          <span className="list-title text-gray-700">
            {getValue<string | null | undefined>() || "—"}
          </span>
        ),
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        size: 120,
        header: () => <p className="column-title">Created</p>,
        cell: ({ getValue }) => {
          const raw = getValue<string | null | undefined>();
          if (!raw) return <span className="list-title">—</span>;

          const date = new Date(raw);
          if (Number.isNaN(date.getTime())) return <span className="list-title">—</span>;

          const formatted = date.toLocaleDateString("en-NZ", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          return <span className="list-title text-gray-500">{formatted}</span>;
        },
      },
      {
        id: "updatedAt",
        accessorKey: "updatedAt",
        size: 120,
        header: () => <p className="column-title">Updated</p>,
        cell: ({ getValue }) => {
          const raw = getValue<string | null | undefined>();
          if (!raw) return <span className="list-title">—</span>;

          const date = new Date(raw);
          if (Number.isNaN(date.getTime())) return <span className="list-title">—</span>;

          const formatted = date.toLocaleDateString("en-NZ", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          return <span className="list-title text-gray-500">{formatted}</span>;
        },
      },
      {
        id: "actions",
        size: 110,
        header: () => (
          <div className="flex w-full justify-end">
            <p className="column-title">Actions</p>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex w-full justify-end pr-2">
            <DataTableRowActions
              record={row.original}
              resource="uom"
              onEdit={onEdit}
            />
          </div>
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
