import type { ReactNode } from "react";
import { useForm } from "@refinedev/react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

type EditFormProps = {
  resource: string;
  record: {
    id: number | string;
    name: string;
    description?: string | null;
    contactName?: string | null;
    email?: string | null;
    phone?: string | null;
    website?: string | null;
  };
  onClose: () => void;
  label?: ReactNode;
  nameRequired?: boolean;
  nameRequiredMessage?: string;
  includeDescription?: boolean;
  descriptionLabel?: ReactNode;
  includeSupplierFields?: boolean;
};

type EditFormValues = {
  name: string;
  description?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  website?: string;
};

export function EditForm({
  resource,
  record,
  onClose,
  label = "Name",
  nameRequired = true,
  nameRequiredMessage = "Name is required",
  includeDescription = false,
  descriptionLabel = "Description",
  includeSupplierFields = false,
}: EditFormProps) {
  const {
    refineCore: { onFinish, formLoading },
    ...form
  } = useForm<EditFormValues>({
    refineCoreProps: {
      resource,
      action: "edit",
      id: String(record.id),
      queryOptions: { enabled: false },
    },
    defaultValues: {
      name: record.name,
      description: record.description ?? "",
      contactName: record.contactName ?? "",
      email: record.email ?? "",
      phone: record.phone ?? "",
      website: record.website ?? "",
    },
  });

  const onSubmit: Parameters<typeof form.handleSubmit>[0] = async (values) => {
    await onFinish({
      name: values.name.trim(),
      ...(includeDescription
        ? { description: values.description?.trim() || null }
        : {}),
      ...(includeSupplierFields
        ? {
            contactName: values.contactName?.trim() || null,
            email: values.email?.trim() || null,
            phone: values.phone?.trim() || null,
            website: values.website?.trim() || null,
          }
        : {}),
    });
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          rules={
            nameRequired
              ? {
                  required: nameRequiredMessage,
                  validate: (value) =>
                    value.trim().length > 0 || nameRequiredMessage,
                }
              : undefined
          }
        />

        {includeDescription && (
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{descriptionLabel}</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value ?? ""} />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        {includeSupplierFields && (
          <>
            <FormField
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Name</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
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
                    <Input type="email" {...field} value={field.value ?? ""} />
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
                    <Input {...field} value={field.value ?? ""} />
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
                      value={field.value ?? ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={formLoading}>
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
