import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BACKEND_BASE_URL } from "@/constants";

type FinishButtonProps = {
  disabled?: boolean;
  assignmentId?: number | null;
  onFinished?: () => void;
};

export function FinishButton({ disabled, assignmentId, onFinished }: FinishButtonProps) {
  // ===== Local UI state =====
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  return (
    <>
      {/* Primary action */}
      <Button size="sm" disabled={disabled} onClick={() => setOpen(true)}>
        Finish Stock Take
      </Button>

      {/* Confirmation dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Stock take has been finished</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent the stock count report to admin@gmail.com
          </p>
          <div className="flex justify-end">
            <Button
              disabled={saving || !assignmentId}
              onClick={async () => {
                // Update assignment status to "done" on confirmation
                if (!assignmentId) {
                  setOpen(false);
                  return;
                }
                setSaving(true);
                try {
                  await fetch(`${BACKEND_BASE_URL}/stocktake-summaries/finish`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ branchAssignmentId: assignmentId }),
                  });
                  onFinished?.();
                } finally {
                  setSaving(false);
                  setOpen(false);
                }
              }}
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
