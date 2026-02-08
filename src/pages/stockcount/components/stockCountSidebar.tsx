import { useMemo, useState } from "react";
import { useList } from "@refinedev/core";
import type { BranchAssignments, Branch } from "@/types";
import { Link } from "react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type StockCountSidebarProps = {
  selectedAssignmentId?: number | null;
  selectedBranchId?: string;
};

function formatMonthLabel(value: string) {
  if (!value) return "";
  const [year, month] = value.split("-");
  if (!year || !month) return value;
  const date = new Date(Number(year), Number(month) - 1, 1);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
}

export function StockCountSidebar({ selectedAssignmentId, selectedBranchId }: StockCountSidebarProps) {
  const { query } = useList<BranchAssignments>({
    resource: "branch-assignments",
    pagination: { pageSize: 100 },
  });

  const { query: branchesQuery } = useList<Branch>({
    resource: "branches",
    pagination: { pageSize: 100 },
  });
  const branches = branchesQuery.data?.data ?? [];

  const [localBranchId, setLocalBranchId] = useState<string>(selectedBranchId ?? "all");

  const assignments = query.data?.data ?? [];

  const items = useMemo(
    () =>
      assignments
        .filter((a) =>
          localBranchId === "all"
            ? true
            : String(a.branchId) === localBranchId
        )
        .map((a) => ({
        id: a.id,
        name: a.name,
        branchId: a.branchId,
        month: a.assignedMonth,
        label: a.name || `${a.branchId} - ${formatMonthLabel(a.assignedMonth)}`,
      })),
    [assignments, localBranchId]
  );

  return (
    <aside className="w-64 shrink-0 rounded-md border bg-background p-4">
      <h2 className="text-sm font-semibold">Stock Count Lists</h2>
      <div className="mt-3">
        <Select value={localBranchId} onValueChange={setLocalBranchId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {branches.map((branch) => (
              <SelectItem key={branch.id} value={String(branch.id)}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mt-3 space-y-2">
        {items.length === 0 && (
          <p className="text-xs text-muted-foreground">No branch assignments.</p>
        )}
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/stockcount?branchAssignmentsId=${item.id}`}
            className={`block rounded-md px-3 py-2 text-sm ${
              selectedAssignmentId === item.id ? "bg-muted font-medium" : "hover:bg-muted"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
