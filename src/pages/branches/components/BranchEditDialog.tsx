import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { EditForm } from "@/components/editForm";
import type { Branch } from "@/types";

type BranchEditDialogProps = {
  editOpen: boolean;
  setEditOpen: (open: boolean) => void;
  selectedBranch: Branch | null;
};

export function BranchEditDialog({
  editOpen,
  setEditOpen,
  selectedBranch,
}: BranchEditDialogProps) {
  return (
    // ===== Dialog UI =====
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>Edit Branch</DialogTitle>
          <DialogDescription>
            Update the branch here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        {/* Edit form */}
        {selectedBranch && (
          <EditForm
            resource="branches"
            record={{ id: selectedBranch.id, name: selectedBranch.name }}
            label={
              <>
                Branch Name <span className="text-orange-600">*</span>
              </>
            }
            nameRequiredMessage="Branch name is required"
            onClose={() => setEditOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
