import { useForm } from "@refinedev/react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";

type EditFormProps = {
  resource: string;
  record: {
    id: number | string;
    name: string;
  };
  onClose: () => void;
  label?: string;
};

export function EditForm({ resource, record, onClose, label = "Name" }: EditFormProps) {
  const {
    refineCore: { onFinish, formLoading },
    ...form
  } = useForm<{ name: string }>({
    refineCoreProps: {
      resource,
      action: "edit",
      id: String(record.id),
      queryOptions: { enabled: false },
    },
    defaultValues: { name: record.name },
  });

  const onSubmit: Parameters<typeof form.handleSubmit>[0] = async (values) => {
    await onFinish(values);
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
            </FormItem>
          )}
        />

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
