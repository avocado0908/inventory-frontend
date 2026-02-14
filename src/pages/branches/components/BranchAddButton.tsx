import { useState } from "react";
import { useForm } from "@refinedev/react-hook-form";
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
    FormMessage,
} from "@/components/ui/form";
import { Plus } from "lucide-react";

type BranchFormValues = {
    name: string;
};

export function BranchAddButton() {
    // ===== Dialog state =====
    const [open, setOpen] = useState(false);

    // ===== Form setup =====
    const {
        refineCore: { onFinish, formLoading },
        ...form
    } = useForm<BranchFormValues>({
        refineCoreProps: {
            resource: "branches",
            action: "create",
        },
        defaultValues: {
            name: "",
        },
    });

    const onSubmit: Parameters<typeof form.handleSubmit>[0] = async (values) => {
        await onFinish({
            name: values.name.trim(),
        });
        setOpen(false);
        form.reset();
    };

    return (
        <>
            {/* Trigger */}
            <Button onClick={() => setOpen(true)}>
                <Plus/> Add Branch
            </Button>

            {/* Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Branch</DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                rules={{
                                    required: "Branch name is required",
                                    validate: (value) =>
                                        value.trim().length > 0 || "Branch name is required",
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Branch Name <span className="text-orange-600">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                >
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
