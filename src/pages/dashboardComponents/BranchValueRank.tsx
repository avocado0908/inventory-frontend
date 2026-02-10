import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type BranchValueRankProps = {
  data: {
    id: number;
    name: string;
    total: number;
    totalsByCategory: { category: string; totalValue: number }[];
  }[];
  formatCurrency: (value: number) => string;
};

export function BranchValueRank({ data, formatCurrency }: BranchValueRankProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<BranchValueRankProps["data"][number] | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Branch Rank</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <div className="h-full overflow-auto">
          {data.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data for this month.</p>
          ) : (
            <div className="space-y-3">
              {data.map((row, index) => (
                <button
                  key={row.name}
                  type="button"
                  className="flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-sm hover:bg-muted"
                  onClick={() => {
                    setSelected(row);
                    setOpen(true);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 text-xs text-muted-foreground">#{index + 1}</span>
                    <span className="font-medium">{row.name}</span>
                  </div>
                  <span>{formatCurrency(row.total)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selected?.name ?? "Branch"} Breakdown</DialogTitle>
          </DialogHeader>
          {selected ? (
            <div className="space-y-2 text-sm">
              {selected.totalsByCategory.length === 0 ? (
                <p className="text-muted-foreground">No category data.</p>
              ) : (
                selected.totalsByCategory.map((row) => (
                  <div key={row.category} className="flex items-center justify-between">
                    <span>{row.category}</span>
                    <span>{formatCurrency(Number(row.totalValue ?? 0))}</span>
                  </div>
                ))
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
