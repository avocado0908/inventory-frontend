import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import type { BranchAssignments, Branch, Product } from "@/types";
import { useDelete, useList } from "@refinedev/core";
import { Badge } from "@/components/ui/badge";
import type { MonthlyInventory } from "@/types";
import { Book, Eye, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BranchAssingmentViewDialog } from "./branchAssingmentViewDialog";

type BranchAssignmentTableProps = {
  onEdit: (assignment: BranchAssignments) => void;
  filters?: any[];
};

export function BranchAssingmentTable({ onEdit, filters = [] }: BranchAssignmentTableProps) {
  // ===== Data fetching =====
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<BranchAssignments | null>(null);
  const { mutate: deleteOne } = useDelete();
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
  const { query: productsQuery } = useList<Product>({
    resource: "products",
    pagination: { pageSize: 10000 },
  });
  const products = productsQuery.data?.data ?? [];

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

  const productById = useMemo(() => {
    const map = new Map<number, Product>();
    products.forEach((product) => map.set(product.id, product));
    return map;
  }, [products]);

  const categoryTotalsForSelected = useMemo(() => {
    if (!selectedAssignment) return [];
    const totals = new Map<string, number>();

    inventoryRows
      .filter(
        (row) =>
          Number(
            row.branchAssignmentsId ??
              (row as unknown as { branchAssignmentId?: number }).branchAssignmentId,
          ) === selectedAssignment.id,
      )
      .forEach((row) => {
        const product = productById.get(row.productId);
        const categoryName = product?.category?.name ?? "Uncategorized";
        const value = Number(row.stockValue ?? 0);
        totals.set(categoryName, (totals.get(categoryName) ?? 0) + value);
      });

    return Array.from(totals.entries())
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);
  }, [inventoryRows, productById, selectedAssignment]);

  const selectedGrandTotal = useMemo(
    () => categoryTotalsForSelected.reduce((sum, item) => sum + item.total, 0),
    [categoryTotalsForSelected],
  );

  // ===== Table columns =====
  const columns = useMemo<ColumnDef<BranchAssignments>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        size: 220,
        header: () => <p className="column-title">Name</p>,
        cell: ({ getValue }) => (
          <div className="flex items-center gap-3 list-title">
            <div className="p-2 bg-secondary rounded-lg">
              <Book className="lucide lucide-package w-4 h-4 text-primary" />
            </div>
            <span className="font-bold">{getValue<string>()}</span>
          </div>
        ),
        filterFn: "includesString",
      },
      
      {
        id: "branchId",
        accessorKey: "branchId",
        size: 160,
        header: () => <p className="column-title">Branch</p>,
        cell: ({ getValue }) => {
          const id = getValue<number>();
          return <span className="list-title text-gray-500">{branchNameById.get(id) ?? "—"}</span>;
        },
      },
      
      {
        id: "totalValue",
        header: () => <p className="column-title">Total Value</p>,
        size: 140,
        cell: ({ row }) => {
          const total = totalByAssignment.get(row.original.id) ?? 0;
          return <span className="list-title font-bold text-green-700">${total.toFixed(2)}</span>;
        },
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
          return (
            <span className="list-title">
              <Badge variant={variant}>{status || "—"}</Badge>
            </span>
          );
        },
      },
      {
        id: "actions",
        size: 100,
        header: () => (
          <div className="flex w-full justify-end">
            <p className="column-title">Actions</p>
          </div>
        ),
        cell: ({ row }) => {
          const assignment = row.original;
          return (
            <div className="flex w-full justify-end gap-2 pr-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedAssignment(assignment);
                  setViewOpen(true);
                }}
              >
                  <Eye className="h-4 w-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="outline" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(assignment)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => {
                      if (!window.confirm("Delete this branch assignment?")) return;
                      deleteOne({
                        resource: "branch-assignments",
                        id: assignment.id,
                      });
                    }}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [onEdit, branchNameById, deleteOne, totalByAssignment]
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
  return (
    <>
      <DataTable table={table} />
      <BranchAssingmentViewDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        selectedAssignment={selectedAssignment}
        categoryTotals={categoryTotalsForSelected}
        grandTotal={selectedGrandTotal}
      />
    </>
  );
}
