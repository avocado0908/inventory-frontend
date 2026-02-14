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
import { Textarea } from "@/components/ui/textarea";


type CategoryFormValues = {
    name: string;
};

export function CategoriesAddButton() {
    // ===== Dialog state =====
    const [open, setOpen] = useState(false);

    // ===== Form setup =====
    const {
        refineCore: { onFinish, formLoading },
        ...form
    } = useForm<CategoryFormValues>({
        refineCoreProps: {
            resource: "categories",
            action: "create",
        },
        defaultValues: {
            name: "",
            description: "",
        },
    });

    const onSubmit: Parameters<typeof form.handleSubmit>[0] = async (values) => {
        await onFinish({
        name: values.name.trim(),
        description: values.description?.trim() || null,
        });
        setOpen(false);
        form.reset();
    };
    
    return (
        <>
            {/* Trigger */}
            <Button onClick={() => setOpen(true)}>
                <Plus/> Add Category
            </Button>

            {/* Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Category</DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Category <span className="text-orange-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                rules={{
                  required: "Category is required",
                  validate: (value) =>
                    value.trim().length > 0 || "Category is required",
                }}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={field.value ?? ""} />
                    </FormControl>
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
