import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import type { Supplier } from "@/types";
import { DataTableRowActions } from "../../../components/table-row-action";
import { Mail, Phone, Truck } from "lucide-react";



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
            size: 100,
            header: () => <p className="column-title">Supplier</p>,
            cell: ({ row }) => {
              const name = row.original.name || "N/A";
              const contactName = row.original.contactName || "Name N/A";

              return (
                <div className="flex items-center gap-3 list-title">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary rounded-lg">
                      <Truck className="lucide lucide-package w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold">{name}</p>
                      <p className="text-[10px] text-gray-400 font-medium uppercase">{contactName}</p>
                    </div>
                  </div>
                

              </div>
              );
            },
            filterFn: "includesString",                     
          },
          {
            id: "contact",
            size: 200,
            header: () => <p className="column-title">Contact Info</p>,
            cell: ({ row }) => {
              const email = row.original.email || "N/A";
              const phone = row.original.phone || "N/A";

              return (
                <div className="list-title whitespace-nowrap">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <Mail className="w-3 h-3 text-gray-400"/>
                      <p className="truncate max-w-[150px]">{email}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <Phone className="w-3 h-3 text-gray-400"/>
                      <p className="truncate max-w-[150px]">{phone}</p>
                    </div>                    
                  </div>
                </div>
              );
            },
            filterFn: "includesString",
          },
          {
            id: "actions",
            size: 100,
            header: () => (
              <div className="flex w-full justify-end">
                <p className="column-title">Actions</p>
              </div>
            ),
            cell: ({ row }) => (
              <div className="flex w-full justify-end pr-2">
                <DataTableRowActions
                  record={row.original}
                  resource="suppliers"
                  onEdit={onEdit}
                />
              </div>
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
