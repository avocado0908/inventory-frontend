import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { BranchAssignments } from "@/types";

type BranchAssignmentViewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAssignment: BranchAssignments | null;
  categoryTotals: { category: string; total: number }[];
  grandTotal: number;
};

export function BranchAssingmentViewDialog({
  open,
  onOpenChange,
  selectedAssignment,
  categoryTotals,
  grandTotal,
}: BranchAssignmentViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{selectedAssignment?.name ?? "Assignment"} Category Totals</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          {categoryTotals.length === 0 ? (
            <p className="text-sm text-muted-foreground">No counted data for this assignment.</p>
          ) : (
            categoryTotals.map((item) => (
              <div key={item.category} className="flex items-center justify-between text-sm">
                <span>{item.category}</span>
                <span className="font-medium">${item.total.toFixed(2)}</span>
              </div>
            ))
          )}

          <div className="mt-3 flex items-center justify-between border-t pt-3 text-sm font-semibold">
            <span>Grand Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
