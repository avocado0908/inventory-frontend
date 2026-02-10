import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { EditForm } from "@/components/editForm";
import type { Category } from "@/types";

type CategoryEditDialogProps = {
  editOpen: boolean;
  setEditOpen: (open: boolean) => void;
  selectedCategory: Category | null;
};

export function CategoryEditDialog({
  editOpen,
  setEditOpen,
  selectedCategory,
}: CategoryEditDialogProps) {
  return (
    // ===== Dialog UI =====
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update the category here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        {/* Edit form */}
        {selectedCategory && (
          <EditForm
            resource="categories"
            record={{ id: selectedCategory.id, name: selectedCategory.name }}
            label="Category Name"
            onClose={() => setEditOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
