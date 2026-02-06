import { Pencil, Trash } from "lucide-react";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { Button } from "@/components/ui/button";

type DataTableRowActionsProps<T> = {
  record: T;
  resource: string;
  onEdit?: (record: T) => void;
};

export function DataTableRowActions<T>({
  record,
  resource,
  onEdit,
}: DataTableRowActionsProps<T>) {
  return (
    <div className="flex gap-2">
      {onEdit && (
        <EditButton
          size="sm"
          variant="outline"
          onClick={() => onEdit(record)}
        >
          <Pencil className="h-4 w-4" />
        </EditButton>
      )}

      <DeleteButton
        resource={resource}
        recordItemId={(record as any).id}
        size="sm"
      >
        <Trash className="h-4 w-4" />
      </DeleteButton>
    </div>
  );
}
