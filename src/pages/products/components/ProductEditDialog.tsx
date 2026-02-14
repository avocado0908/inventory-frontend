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
  // ===== Form setup =====
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
      barcode: "",
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

  // ===== Hydrate form when selection changes =====
  useEffect(() => {
    if (!selectedProduct) return;
    reset({
      name: selectedProduct.name ?? "",
      categoryId: selectedProduct.category?.id ?? selectedProduct.categoryId ?? 0,
      supplierId: selectedProduct.supplier?.id ?? selectedProduct.supplierId ?? 0,
      uomId: selectedProduct.uom?.id ?? selectedProduct.uomId ?? 0,
      price: selectedProduct.price ?? 0,
      barcode: selectedProduct.barcode ?? "",
      pkg: selectedProduct.pkg ?? 1,
      description: selectedProduct.description ?? "",
    });
  }, [reset, selectedProduct]);

  // ===== Fetch option lists =====
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

  // ===== Submit edits =====
  const onSubmit: Parameters<typeof form.handleSubmit>[0] = async (values) => {
    await onFinish({
      ...values,
      name: String(values.name).trim(),
      categoryId: Number(values.categoryId),
      supplierId: Number(values.supplierId),
      uomId: Number(values.uomId),
      price: Number(values.price),
      pkg: Number(values.pkg),
    });
    setEditOpen(false);
  };

return (
    // ===== Dialog UI =====
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
                  rules={{
                    required: "Product name is required",
                    validate: (value) =>
                      String(value ?? "").trim().length > 0 ||
                      "Product name is required",
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name <span className="text-orange-600">*</span></FormLabel>
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
                  rules={{
                    validate: (value) =>
                      Number(value) > 0 || "Category is required",
                  }}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Category <span className="text-orange-600">*</span></FormLabel>
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
                  rules={{
                    validate: (value) =>
                      Number(value) > 0 || "Supplier is required",
                  }}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Supplier <span className="text-orange-600">*</span></FormLabel>
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
                    rules={{
                      validate: (value) => {
                        const n = Number(value);
                        if (Number.isNaN(n)) return "Price is required";
                        if (n < 0) return "Price must be 0 or greater";
                        return true;
                      },
                    }}
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
                    name="barcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Barcode</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="pkg"
                    rules={{
                      validate: (value) =>
                        Number(value) > 0 ||
                        "Package quantity is required",
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Package Quantity - PKG<span className="text-orange-600">*</span></FormLabel>
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
                    rules={{
                      validate: (value) =>
                        Number(value) > 0 || "UOM is required",
                    }}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Unit of Measure - UOM <span className="text-orange-600">*</span></FormLabel>
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
    
