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
  };
  onClose: () => void;
  label?: ReactNode;
  nameRequired?: boolean;
  nameRequiredMessage?: string;
  includeDescription?: boolean;
  descriptionLabel?: ReactNode;
};

type EditFormValues = {
  name: string;
  description?: string;
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
    },
  });

  const onSubmit: Parameters<typeof form.handleSubmit>[0] = async (values) => {
    await onFinish({
      name: values.name.trim(),
      ...(includeDescription
        ? { description: values.description?.trim() || null }
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
