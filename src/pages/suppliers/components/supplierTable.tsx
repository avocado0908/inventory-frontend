import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import type { Supplier } from "@/types";
import { DataTableRowActions } from "../../../components/table-row-action";



type SupplierTable = {
    onEdit: (supplier: Supplier) => void;
      filters?: any[];
    };
    
    export function SupplierTable({ onEdit, filters = [] }: SupplierTable) {
      // ===== Table columns =====
      const supplierColumns = useMemo<ColumnDef<Supplier>[]>(
        () => [
          {
            id: "name",
            accessorKey: "name",
            size: 100,
            header: () => <p className="column-title">Name</p>,
            cell: ({ getValue }) => (
              <span className="text-foreground">{getValue<string>()}</span>
            ),
            filterFn: "includesString",
          },
          {
            id: "contactName",
            accessorKey: "contactName",
            size: 150,
            header: () => <p className="column-title">Contact Name</p>,
            cell: ({ getValue }) => (
              <span className="truncate line-clamp-2 block">
                    {getValue<string | null | undefined>()
                      ? `${getValue<string | null | undefined>()}`
                      : "—"}
                  </span>
            ),
            filterFn: "includesString",
          },
          {
            id: "email",
            accessorKey: "email",
            size: 200,
            header: () => <p className="column-title">Email</p>,
            cell: ({ getValue }) => (
              <span className="truncate line-clamp-2 block">
                    {getValue<string | null | undefined>()
                      ? `${getValue<string | null | undefined>()}`
                      : "—"}
                  </span>
            ),
            filterFn: "includesString",
          },
          {
            id: "phone",
            accessorKey: "phone",
            size: 100,
            header: () => <p className="column-title">Phone</p>,
            cell: ({ getValue }) => (
              <span className="truncate line-clamp-2 block">
                    {getValue<string | null | undefined>()
                      ? `${getValue<string | null | undefined>()}`
                      : "—"}
                  </span>
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
                resource="suppliers"
                onEdit={onEdit} 
              />
            ),
          },
        ],
        [onEdit]
      );
    
      const supplierTable = useTable<Supplier>({
        columns: supplierColumns,
        refineCoreProps: {
          resource: "suppliers",
          pagination: { pageSize: 10, mode: "server" },
          filters: { permanent: filters },
          sorters: { initial: [{ field: "id", order: "desc" }] },
        },
      });
    
      // ===== Render =====
      return <DataTable table={supplierTable} />;
}
