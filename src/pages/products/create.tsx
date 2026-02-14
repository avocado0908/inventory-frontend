import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { CreateView } from "@/components/refine-ui/views/create-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useBack, useList, type BaseRecord, type HttpError } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ChevronsUpDown, Check } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { Category, Supplier, Uom } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const productCreateSchema = z.object({
  categoryId: z.coerce.number().min(1, "Category is required"),
  supplierId: z.coerce.number().min(1, "Supplier is required"),
  name: z.string().min(2, "Product name must be at least 2 characters"),
  price: z.coerce.number().min(1, "Price must be $1 or more"),
  barcode: z.string().optional(),
  pkg: z.coerce.number().int().min(1, "PKG must be at least 1"),
  uomId: z.coerce.number().min(1, "UOM is required"),
  description: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productCreateSchema>;

const ProductsCreate = () => {
  // ===== Navigation =====
  const back = useBack();

  // ===== Form setup =====
  const form = useForm<BaseRecord, HttpError, ProductFormValues>({
    resolver: zodResolver(productCreateSchema),
    refineCoreProps: { resource: "products", action: "create" },
    defaultValues: {
      categoryId: 0,
      supplierId: 0,
      name: "",
      price: 0,
      barcode: "",
      pkg: 0,
      uomId: 0,
      description: "",
    },
  });

  const {
    refineCore: { onFinish },
    handleSubmit,
    formState: { isSubmitting },
    control,
    setValue,
  } = form;

  // ===== Fetch options =====
  const { query: categoriesQuery } = useList<Category>({ resource: "categories", pagination: { pageSize: 100 } });
  const { query: suppliersQuery } = useList<Supplier>({ resource: "suppliers", pagination: { pageSize: 100 } });
  const { query: uomQuery } = useList<Uom>({ resource: "uom", pagination: { pageSize: 100 } });

  const categories = categoriesQuery.data?.data ?? [];
  const suppliers = suppliersQuery.data?.data ?? [];
  const uom = uomQuery.data?.data ?? [];

  // ===== Submit handler =====
  const onSubmit = async (values: ProductFormValues) => {
    try {
      await onFinish(values);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    // ===== Page layout =====
    <CreateView>
      <Breadcrumb />
      <h1 className="page-title">Create a Product</h1>

      <div className="intro-row">
        <p>Provide the required information below to add a product.</p>
        <Button onClick={() => back()}>Go Back</Button>
      </div>

      <Separator />

      
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-4 max-w-2xl">

              {/* Product Name */}
              <FormField control={control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name <span className="text-orange-600">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Category */}
              <FormField control={control} name="categoryId" render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Category <span className="text-orange-600">*</span></FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                          type="button"
                          disabled={categoriesQuery.isLoading}
                        >
                          {field.value ? categories.find(c => c.id === field.value)?.name : "Select a category..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search category..." />
                        <CommandList>
                          <CommandEmpty>No category found.</CommandEmpty>
                          <CommandGroup>
                            {categories.map((option) => (
                              <CommandItem
                                key={option.id}
                                value={option.name}
                                onSelect={() => setValue("categoryId", option.id)}
                              >
                                <Check className={cn("mr-2 h-4 w-4", option.id === field.value ? "opacity-100" : "opacity-0")} />
                                {option.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Supplier */}
              <FormField control={control} name="supplierId" render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Supplier <span className="text-orange-600">*</span></FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                          type="button"
                          disabled={suppliersQuery.isLoading}
                        >
                          {field.value ? suppliers.find(s => s.id === field.value)?.name : "Select a supplier..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search supplier..." />
                        <CommandList>
                          <CommandEmpty>No supplier found.</CommandEmpty>
                          <CommandGroup>
                            {suppliers.map((option) => (
                              <CommandItem
                                key={option.id}
                                value={option.name}
                                onSelect={() => setValue("supplierId", option.id)}
                              >
                                <Check className={cn("mr-2 h-4 w-4", option.id === field.value ? "opacity-100" : "opacity-0")} />
                                {option.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Price */}
                <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price <span className="text-orange-600">*</span></FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Barcode */}
                <FormField control={form.control} name="barcode" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Barcode</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* PKG */}
                <FormField control={form.control} name="pkg" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Package Quantity - PKG <span className="text-orange-600">*</span></FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* UOM */}
                <FormField control={control} name="uomId" render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Unit of Measure - UOM <span className="text-orange-600">*</span></FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                            type="button"
                            disabled={uomQuery.isLoading}
                          >
                            {field.value ? uom.find(u => u.id === field.value)?.name : "Select a UOM..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search UOM..." />
                          <CommandList>
                            <CommandEmpty>No UOM found.</CommandEmpty>
                            <CommandGroup>
                              {uom.map(option => (
                                <CommandItem
                                  key={option.id}
                                  value={option.name}
                                  onSelect={() => setValue("uomId", option.id)}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", option.id === field.value ? "opacity-100" : "opacity-0")} />
                                  {option.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* Description */}
              <FormField control={control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the product..." className="min-h-28" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Product"}
              </Button>

            </form>
          </Form>

    </CreateView>
  );
};

export default ProductsCreate;
