import { useEffect } from "react";
import { useForm } from "@refinedev/react-hook-form";
import { useList } from "@refinedev/core";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category, Product, Supplier, Uom } from "@/types";

type ProductEditDialogProps = {
  editOpen: boolean;
  setEditOpen: (open: boolean) => void;
  selectedProduct: Product | null;
};

export function ProductEditDialog({
    editOpen,
    setEditOpen,
    selectedProduct,
}: ProductEditDialogProps ) {
  const form = useForm({
    refineCoreProps: {
      resource: "products",
      action: "edit",
      id: selectedProduct ? String(selectedProduct.id) : undefined,
      queryOptions: { enabled: false },
    },
    defaultValues: {
      name: "",
      categoryId: 0,
      supplierId: 0,
      price: 0,
      pkg: 0,
      uomId: 0,
      description: "",
    },
  });

  const {
    refineCore: { onFinish, formLoading },
    handleSubmit,
    control,
    setValue,
    reset,
  } = form;

  useEffect(() => {
    if (!selectedProduct) return;
    reset({
      name: selectedProduct.name ?? "",
      categoryId: selectedProduct.category?.id ?? selectedProduct.categoryId ?? 0,
      supplierId: selectedProduct.supplier?.id ?? selectedProduct.supplierId ?? 0,
      uomId: selectedProduct.uom?.id ?? selectedProduct.uomId ?? 0,
      price: selectedProduct.price ?? 0,
      pkg: selectedProduct.pkg ?? 1,
      description: selectedProduct.description ?? "",
    });
  }, [reset, selectedProduct]);

  const { query: categoriesQuery } = useList<Category>({
    resource: "categories",
    pagination: { pageSize: 100 },
  });
  const { query: suppliersQuery } = useList<Supplier>({
    resource: "suppliers",
    pagination: { pageSize: 100 },
  });
  const { query: uomQuery } = useList<Uom>({
    resource: "uom",
    pagination: { pageSize: 100 },
  });

  const categories = categoriesQuery.data?.data ?? [];
  const suppliers = suppliersQuery.data?.data ?? [];
  const uom = uomQuery.data?.data ?? [];

  const onSubmit: Parameters<typeof form.handleSubmit>[0] = async (values) => {
    await onFinish(values);
    setEditOpen(false);
  };

return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader className="text-start">
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Update the product here. Click save when you're done.
          </DialogDescription>

          {selectedProduct && (
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Category</FormLabel>
                      <Select
                        value={field.value ? String(field.value) : ""}
                        onValueChange={(value) => setValue("categoryId", Number(value))}
                        disabled={categoriesQuery.isLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((option) => (
                            <SelectItem key={option.id} value={String(option.id)}>
                              {option.name}
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
                  name="supplierId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Supplier</FormLabel>
                      <Select
                        value={field.value ? String(field.value) : ""}
                        onValueChange={(value) => setValue("supplierId", Number(value))}
                        disabled={suppliersQuery.isLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a supplier..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {suppliers.map((option) => (
                            <SelectItem key={option.id} value={String(option.id)}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price <span className="text-orange-600">*</span></FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="pkg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Package Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="uomId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Unit of Measure - UOM</FormLabel>
                        <Select
                          value={field.value ? String(field.value) : ""}
                          onValueChange={(value) => setValue("uomId", Number(value))}
                          disabled={uomQuery.isLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a UOM..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {uom.map((option) => (
                              <SelectItem key={option.id} value={String(option.id)}>
                                {option.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the product..." className="min-h-24" {...field} />
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
    
