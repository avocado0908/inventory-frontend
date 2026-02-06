import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import type { Category } from "@/types";
import { DataTableRowActions } from "./table-row-action";


type CategoriesTable = {
  onEdit: (category: Category) => void;
  filters?: any[];
};

export function CategoriesTable({ onEdit, filters = [] }: CategoriesTable) {
  const categoryColumns = useMemo<ColumnDef<Category>[]>(
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
            resource="categories"
            onEdit={onEdit} 
          />
        ),
      },
    ],
    [onEdit]
  );

  const categoryTable = useTable<Category>({
    columns: categoryColumns,
    refineCoreProps: {
      resource: "categories",
      pagination: { pageSize: 10, mode: "server" },
      filters: { permanent: filters },
      sorters: { initial: [{ field: "id", order: "desc" }] },
    },
  });

  return <DataTable table={categoryTable} />;
}
