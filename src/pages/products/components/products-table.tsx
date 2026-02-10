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
                  <span className="truncate line-clamp-2 block">
                    {getValue<string>()}
                  </span>
                ),
                filterFn: "includesString",
            },
            {
                id: "price",
                accessorKey: "price",
                size: 120,
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
                id: "barcode",
                accessorKey: "barcode",
                size: 140,
                meta: { align: "center" },
                header: () => <p className="column-title text-center">Barcode</p>,
                cell: ({ getValue }) => (
                  <span className="text-foreground text-center block">
                    {getValue<string | null | undefined>() || "—"}
                  </span>
                ),
            },
            {
                id: "supplier",
                accessorKey: "supplier.name",
                size: 100,
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
                size: 100,
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
                size: 100,
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
                size: 160,
                meta: { align: "center" },
                header: () => <p className="column-title text-center">Actions</p>,
                cell: ({ row }) => (
                            <div className="flex justify-center">
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
