import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Supplier } from "@/types";
import { useForm } from "@refinedev/react-hook-form";

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
  // ===== Form setup =====
  const form = useForm({
    refineCoreProps: {
      resource: "suppliers",
      action: "edit",
      id: selectedSupplier ? String(selectedSupplier.id) : undefined,
      queryOptions: { enabled: false },
    },
    defaultValues: {
      name: "",
      contactName: "",
      email: "",
      phone: "",
    },
  });

  const {
    refineCore: { onFinish, formLoading },
    handleSubmit,
    control,
    reset,
  } = form;

  // ===== Hydrate form when selection changes =====
  useEffect(() => {
    if (!selectedSupplier) return;
    reset({
      name: selectedSupplier.name ?? "",
      contactName: selectedSupplier.contactName ?? "",
      email: selectedSupplier.email ?? "",
      phone: selectedSupplier.phone ?? "",
    });
  }, [reset, selectedSupplier]);

  // ===== Submit edits =====
  const onSubmit: Parameters<typeof form.handleSubmit>[0] = async (values) => {
    await onFinish(values);
    setEditOpen(false);
  };

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
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={formLoading}>
                  Save
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
