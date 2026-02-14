import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { Supplier } from "@/types";
import { EditForm } from "@/components/editForm";

type SupplierEditDialogProps = {
  editOpen: boolean;
  setEditOpen: (open: boolean) => void;
  selectedSupplier: Supplier | null;
};

export function SupplierEditDialog({
  editOpen,
  setEditOpen,
  selectedSupplier,
}: SupplierEditDialogProps) {
  return (
    // ===== Dialog UI =====
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>Edit Supplier</DialogTitle>
          <DialogDescription>
            Update the supplier here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {/* Edit form */}
        {selectedSupplier && (
          <EditForm
            resource="suppliers"
            record={{
              id: selectedSupplier.id,
              name: selectedSupplier.name,
              contactName: selectedSupplier.contactName ?? "",
              email: selectedSupplier.email ?? "",
              phone: selectedSupplier.phone ?? "",
              website: selectedSupplier.website ?? "",
            }}
            label={
              <>
                Supplier Name <span className="text-orange-600">*</span>
              </>
            }
            nameRequiredMessage="Supplier name is required"
            includeSupplierFields
            onClose={() => setEditOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
