import { useMemo } from "react";
import { useList } from "@refinedev/core";
import type { BranchAssignments } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type StockcountTableProps = {
  month: string;
};

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function StockcountTable({ month }: StockcountTableProps) {
  const { query } = useList<BranchAssignments>({
    resource: "branch-assignments",
    pagination: { pageSize: 1000 },
  });

  const rows = useMemo(() => {
    const list = query.data?.data ?? [];
    return list
      .filter((item) => item.assignedMonth?.slice(0, 7) === month)
      .sort((a, b) => String(b.assignedMonth).localeCompare(String(a.assignedMonth)));
  }, [query.data?.data, month]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Branch Assignment</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Updated At</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">
              No current month stock counts.
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row) => {
            const variant =
              row.status === "done"
                ? "secondary"
                : row.status === "in progress"
                  ? "default"
                  : "outline";
            return (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell>
                  <Badge variant={variant}>{row.status}</Badge>
                </TableCell>
                <TableCell>{formatDate(row.assignedAt)}</TableCell>
                <TableCell>{formatDate(row.updatedAt)}</TableCell>
                <TableCell className="text-right">
                  <Button asChild size="sm">
                    <Link to={`/stockcount-entry?branchAssignmentsId=${row.id}`}>Start</Link>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
