import { useEffect } from "react";
import { useForm } from "@refinedev/react-hook-form";
import { useList } from "@refinedev/core";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Branch, BranchAssignments } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BranchAssignmentEditDialogProps = {
  editOpen: boolean;
  setEditOpen: (open: boolean) => void;
  selectedAssignment: BranchAssignments | null;
};

function formatMonthLabel(value: string) {
  if (!value) return "";
  const [year, month] = value.split("-");
  if (!year || !month) return value;
  const date = new Date(Number(year), Number(month) - 1, 1);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
}

export function BranchAssingmentEditDialog({
  editOpen,
  setEditOpen,
  selectedAssignment,
}: BranchAssignmentEditDialogProps) {
  const { query: branchesQuery } = useList<Branch>({
    resource: "branches",
    pagination: { pageSize: 100 },
  });
  const branches = branchesQuery.data?.data ?? [];

  const form = useForm({
    refineCoreProps: {
      resource: "branch-assignments",
      action: "edit",
      id: selectedAssignment ? String(selectedAssignment.id) : undefined,
      queryOptions: { enabled: false },
    },
    defaultValues: {
      name: "",
      branchId: 0,
      assignedMonth: "",
    },
  });

  const {
    refineCore: { onFinish, formLoading },
    handleSubmit,
    control,
    reset,
  } = form;

  const branchIdValue = form.watch("branchId");
  const assignedMonthValue = form.watch("assignedMonth");
  const branchName =
    branches.find((b) => b.id === Number(branchIdValue))?.name ?? "";
  const monthLabel = formatMonthLabel(assignedMonthValue);
  const computedName =
    branchName && monthLabel ? `${branchName} - ${monthLabel}` : "";

  if (computedName && form.getValues("name") !== computedName) {
    form.setValue("name", computedName);
  }

  useEffect(() => {
    if (!selectedAssignment) return;
    reset({
      name: selectedAssignment.name ?? "",
      branchId: selectedAssignment.branchId ?? 0,
      assignedMonth: selectedAssignment.assignedMonth?.slice(0, 7) ?? "",
    });
  }, [reset, selectedAssignment]);

  const onSubmit: Parameters<typeof form.handleSubmit>[0] = async (values) => {
    await onFinish(values);
    setEditOpen(false);
  };

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-start">
          <DialogTitle>Edit Branch Assignment</DialogTitle>
          <DialogDescription>
            Update the assignment here. Click save when you are done.
          </DialogDescription>
        </DialogHeader>

        {selectedAssignment && (
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignment Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="branchId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch</FormLabel>
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(value) =>
                        form.setValue("branchId", Number(value))
                      }
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a branch..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch.id} value={String(branch.id)}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="assignedMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned Month</FormLabel>
                    <FormControl>
                      <Input type="month" {...field} />
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
