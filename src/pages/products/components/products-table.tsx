import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import type { Product } from "@/types";
import { DataTableRowActions } from "../../../components/table-row-action";
import { Badge } from "@/components/ui/badge";


type ProductsTable = {
    onEdit:(product: Product) => void;
    filters?: any[];
}

export const ProductsTable = ({ onEdit, filters = [] }: ProductsTable) => {
    // ===== Table columns =====
    const productColumns = useMemo<ColumnDef<Product>[]>(
        () => [
            {
                id: "category",
                accessorKey: "category.name",
                size: 100,
                meta: { align: "center" },
                header: () => <p className="column-title text-center">Category</p>,
                cell: ({ getValue }) => (
                  <div className="flex justify-center">
                    <Badge>{getValue<string>()}</Badge>
                  </div>
                ),
            },
            {
                id: "name",
                accessorKey: "name",
                size: 300,
                header: () => <p className="column-title">Name</p>,
                cell: ({ getValue }) => (
                  <span className="list-title font-bold">
                    {getValue<string>()}
                  </span>
                ),
                filterFn: "includesString",
            },
            {
                id: "price",
                accessorKey: "price",
                size: 80,
                meta: { align: "center" },
                header: () => <p className="column-title text-center">Price</p>,
                cell: ({ getValue }) => (
                  <span className="text-foreground text-center block">
                    {getValue<number | null | undefined>() !== null &&
                    getValue<number | null | undefined>() !== undefined
                      ? `$${getValue<number | null | undefined>()}`
                      : "—"}
                  </span>
                ),
            },
            {
                id: "supplier",
                accessorKey: "supplier.name",
                size: 80,
                meta: { align: "center" },
                header: () => <p className="column-title text-center">Supplier</p>,
                cell: ({ getValue }) => (
                  <div className="flex justify-center">
                    <Badge variant="secondary">{getValue<string>()}</Badge>
                  </div>
                ),
            },
            {
                id: "pkg",
                accessorKey: "pkg",
                size: 80,
                meta: { align: "center" },
                header: () => <p className="column-title text-center">PKG</p>,
                cell: ({ getValue }) => (
                  <span className="text-foreground text-center block">
                    {getValue<number>()}
                  </span>
                ),
            },
            {
                id: "uom",
                accessorKey: "uom.name",
                size: 60,
                meta: { align: "center" },
                header: () => <p className="column-title text-center">UOM</p>,
                cell: ({ getValue }) => (
                  <span className="text-foreground text-center block">
                    {getValue<string>()}
                  </span>
                ),
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
                    resource="products"
                    onEdit={onEdit} 
                    />
                    </div>
                ),
            },
        ],
        [onEdit]
    );

    const productsTable = useTable<Product>({
    columns: productColumns,
    refineCoreProps: {
      resource: "products",
      pagination: { pageSize: 10, mode: "server" },
      filters: { permanent: filters },
      sorters: { initial: [{ field: "id", order: "desc" }] },
    },
  });

  // ===== Render =====
  return <DataTable table={productsTable} />;
}
