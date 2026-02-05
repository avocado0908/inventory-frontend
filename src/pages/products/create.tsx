import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb"
import { CreateView } from "@/components/refine-ui/views/create-view"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useBack, useList, type BaseRecord, type HttpError } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod/v3";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category, Supplier, Uom } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";



export const productCreateSchema = z.object({
  categoryId: z.coerce
    .number({
      required_error: "Category is required",
      invalid_type_error: "Category is required",
    })
    .min(1, "Category is required"),

  supplierId: z.coerce
    .number({
      required_error: "Supplier is required",
      invalid_type_error: "Supplier is required",
    })
    .min(1, "Supplier is required"),

  name: z.string().min(2, "Product name must be at least 2 characters"),

  pkg: z.coerce
  .number({
    required_error: "PKG is required",
    invalid_type_error: "PKG must be a number",
  })
  .int("PKG must be an integer")
  .min(1, "PKG must be at least 1"),

  uomId: z.coerce
    .number({
      required_error: "UOM is required",
      invalid_type_error: "UOM is required",
    })
    .min(1, "UOM is required"),

  description: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productCreateSchema>;

const ProductsCreate = () => {
  const back = useBack();

  const form = useForm<BaseRecord, HttpError, ProductFormValues>({
    resolver: zodResolver(productCreateSchema),
    refineCoreProps: {
      resource: "Products",
      action: "create",
    },
    defaultValues: {
      categoryId: 0,
      name: "",
      description: "",
    },
  });

  const {
    refineCore: { onFinish },
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = form;

  const { query: categoriesQuery } = useList<Category>({
    resource: "categories",
    pagination: {
      pageSize: 100,
    },
  });

  const { query: suppliersQuery } = useList<Supplier>({
    resource: "suppliers",
    pagination: {
      pageSize: 100,
    },
  });

  const { query: uomQuery } = useList<Uom>({
    resource: "uom",
    pagination: {
      pageSize: 100,
    },
  });

  const categories = categoriesQuery.data?.data ?? [];
  const categoriesLoading = categoriesQuery.isLoading;

  const suppliers = suppliersQuery.data?.data ?? [];
  const suppliersLoading = suppliersQuery.isLoading;

  const uom = uomQuery.data?.data ?? [];
  const uomLoading = uomQuery.isLoading;

  const onSubmit = async (values: ProductFormValues) => {
    try {
      await onFinish(values);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <CreateView>
      <Breadcrumb />

       <h1 className="page-title">Create a Product</h1>
       <div className="intro-row">
        <p>Provide the required information below to add a product.</p>
        <Button onClick={() => back()}> Go Back</Button> 
       </div>

       <Separator />

       <div className="my-4 flex items-center">
        <Card className="class-form-card">
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">
              Fill out form
            </CardTitle>
          </CardHeader>

          <Separator />

          <CardContent className="mt-7">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                

                {/* Product name */}
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Product Name <span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Coconut Oil" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField control={control} name="categoryId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Category <span className="text-orange-600">*</span>
                    </FormLabel>
                    <Select
                        onValueChange={(value) =>
                          field.onChange(Number(value))
                        }
                        value={field.value ? String(field.value) : ""}
                        disabled={categoriesLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder='Select a category' />                        
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={String(category.id)}
                            >
                              {category.name}
                        </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* supplier */}
                <FormField control={control} name="supplierId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Supplier <span className="text-orange-600">*</span>
                    </FormLabel>
                    <Select
                        onValueChange={(value) =>
                          field.onChange(Number(value))
                        }
                        value={field.value ? String(field.value) : ""}
                        disabled={suppliersLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder='Select a supplier' />                        
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {suppliers.map((supplier) => (
                            <SelectItem
                              key={supplier.id}
                              value={String(supplier.id)}
                            >
                              {supplier.name}
                        </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                
                  {/* PKG name */}
                  <FormField
                    control={control}
                    name="pkg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Package - PKG <span className="text-orange-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Package number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* uom */}
                  <FormField control={control} name="uomId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Unit of Measure - UOM <span className="text-orange-600">*</span>
                      </FormLabel>
                      <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field.value ? String(field.value) : ""}
                          disabled={uomLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder='Select a uom' />                        
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {uom.map((uom) => (
                              <SelectItem
                                key={uom.id}
                                value={String(uom.id)}
                              >
                                {uom.name}
                          </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                  {/* Description */}
                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the product..."
                          className="min-h-28"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Subject"}
                </Button>

              </form>
            </Form>
          </CardContent>
        </Card>
       </div>
    </CreateView>
      

  )
}

export default ProductsCreate