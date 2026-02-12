import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { EditForm } from "@/components/editForm";
import type { Uom } from "@/types";

type UomEditDialogProps = {
  editOpen: boolean;
  setEditOpen: (open: boolean) => void;
  selectedUom: Uom | null;
};

export function UomEditDialog({
  editOpen,
  setEditOpen,
  selectedUom,
}: UomEditDialogProps) {
  return (
    // ===== Dialog UI =====
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-start">
          <DialogTitle>Edit UOM</DialogTitle>
          <DialogDescription>
            Update the unit of measure here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        {/* Edit form */}
        {selectedUom && (
          <EditForm
            resource="uom"
            record={{
              id: selectedUom.id,
              name: selectedUom.name,
            }}
            label="UOM Name"
            onClose={() => setEditOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
