import { useMemo, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PreviousStockcountTableProps = {
  currentMonth: string;
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

export function PreviousStockcountTable({ currentMonth }: PreviousStockcountTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { query } = useList<BranchAssignments>({
    resource: "branch-assignments",
    pagination: { pageSize: 1000 },
  });

  const rows = useMemo(() => {
    const list = query.data?.data ?? [];
    return list
      .filter((item) => item.assignedMonth?.slice(0, 7) !== currentMonth)
      .sort((a, b) => String(b.assignedMonth).localeCompare(String(a.assignedMonth)));
  }, [query.data?.data, currentMonth]);

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, currentPage, pageSize]);

  const from = rows.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, rows.length);

  return (
    <div>
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
                No previous stock counts.
              </TableCell>
            </TableRow>
          ) : (
            paginatedRows.map((row) => {
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
                      <Link to={`/stockcount-entry?branchAssignmentsId=${row.id}`}>Manage</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between border-t px-4 py-3 text-sm">
        <div className="text-muted-foreground">
          {rows.length === 0 ? "0 rows" : `${from}-${to} of ${rows.length} rows`}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Rows per page</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= pageCount}
            onClick={() => setCurrentPage((prev) => Math.min(pageCount, prev + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
