import { useState } from "react";
import { useForm } from "@refinedev/react-hook-form";
import { useList } from "@refinedev/core";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Plus } from "lucide-react";
import type { Branch } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BranchAssignmentFormValues = {
  name: string;
  branchId: number;
  assignedMonth: string;
};

// Format YYYY-MM to readable label (e.g., Feb 2026)
function formatMonthLabel(value: string) {
  if (!value) return "";
  const [year, month] = value.split("-");
  if (!year || !month) return value;
  const date = new Date(Number(year), Number(month) - 1, 1);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
}

export function BranchAssingmentAddButton() {
  // ===== Dialog state =====
  const [open, setOpen] = useState(false);

  // ===== Data fetching =====
  const { query: branchesQuery } = useList<Branch>({
    resource: "branches",
    pagination: { pageSize: 100 },
  });
  const branches = branchesQuery.data?.data ?? [];

  // ===== Form setup =====
  const {
    refineCore: { onFinish, formLoading },
    ...form
  } = useForm<BranchAssignmentFormValues>({
    refineCoreProps: {
      resource: "branch-assignments",
      action: "create",
    },
    defaultValues: {
      name: "",
      branchId: 0,
      assignedMonth: "",
    },
  });

  const branchIdValue = form.watch("branchId");
  const assignedMonthValue = form.watch("assignedMonth");
  const branchName =
    branches.find((b) => b.id === Number(branchIdValue))?.name ?? "";
  const monthLabel = formatMonthLabel(assignedMonthValue);
  const computedName =
    branchName && monthLabel ? `${branchName} - ${monthLabel}` : "";

  // Keep assignment name in sync with branch + month
  if (computedName && form.getValues("name") !== computedName) {
    form.setValue("name", computedName);
  }

  // Submit new assignment
  const onSubmit: Parameters<typeof form.handleSubmit>[0] = async (values) => {
    await onFinish(values);
    setOpen(false);
    form.reset();
  };

  return (
    <>
      {/* Trigger */}
      <Button onClick={() => setOpen(true)}>
        <Plus /> Add Assignment
      </Button>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Branch Assignment</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="branchId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch</FormLabel>
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(value) => form.setValue("branchId", Number(value))}
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
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignedMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned Month</FormLabel>
                    <FormControl>
                      <Input type="month" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={formLoading}>
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
