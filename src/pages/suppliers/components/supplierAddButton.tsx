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

type SuppliterFormValues = {
    name: string;
    contactName?: string;
    email?: string;
    phone?: string;
    website?: string;
};

export function SupplierAddButton () {
    // ===== Dialog state =====
    const [open, setOpen] = useState(false);

    // ===== Form setup =====
    const {
            refineCore: { onFinish, formLoading },
            ...form
        } = useForm<SuppliterFormValues>({
            refineCoreProps: {
                resource: "suppliers",
                action: "create",
            },
            defaultValues: {
                name: "",
                contactName: "",
                email: "",
                phone: "",
                website: "",
            },
        });
    
        const onSubmit: Parameters<typeof form.handleSubmit>[0] = async (values) => {
            await onFinish({
                ...values,
                name: values.name.trim(),
                contactName: values.contactName?.trim() || null,
                email: values.email?.trim() || null,
                phone: values.phone?.trim() || null,
                website: values.website?.trim() || null,
            });
            setOpen(false);
            form.reset();
        };

  return (
    <>
            {/* Trigger */}
            <Button onClick={() => setOpen(true)}>
                <Plus/> Add Supplier
            </Button>

            {/* Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Supplier</DialogTitle>
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
                                    required: "Supplier name is required",
                                    validate: (value) =>
                                        value.trim().length > 0 || "Supplier name is required",
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Supplier Name<span className="text-orange-600">*</span></FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="contactName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="website"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Website URL</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="url"
                                                placeholder="https://example.com"
                                                {...field}
                                            />
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
