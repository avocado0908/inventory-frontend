import { CreateButton } from "@/components/refine-ui/buttons/create";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from "@/types";
import { useList } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Search, Trash } from "lucide-react";
import { useMemo, useState } from "react";
import type { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditForm } from "@/components/editForm";
import { ProductsTable } from "./components/products-table";
import { CategoryEditDialog } from "../categories/components/categoryEditDialog";
import { ProductEditDialog } from "./components/ProductEditDialog";

const ProductsList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    

    const categoryFilters =
        selectedCategory === "all"
            ? []
            : [
                  {
                      field: "category",
                      operator: "eq" as const,
                      value: selectedCategory,
                  },
              ];

    const searchFilters = searchQuery
        ? [
              {
                  field: "name",
                  operator: "contains" as const,
                  value: searchQuery,
              },
          ]
        : [];



    const { query: categoriesQuery } = useList<Category>({
        resource: "categories",
        pagination: { pageSize: 100 },
    });

    const categories = categoriesQuery.data?.data ?? [];

    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">Products</h1>

            <div className="intro-row">
                <p>Quick access to essential metrics and management tools.</p>

                <div className="actions-row">
                    <div className="search-field">
                        <Search className="search-icon" />
                        <Input
                            type="text"
                            placeholder="Search by name or barcode..."
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={String(category.id)}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <CreateButton resource="products" />
                    </div>
                </div>
            </div>

           <ProductsTable
                       key={JSON.stringify([...categoryFilters, ...searchFilters])}
                       filters={[...categoryFilters, ...searchFilters]}
                       onEdit={(product) => {
                         setSelectedProduct(product);
                         setEditOpen(true);
                       }}
                     />

            {/* Edit modal */}
            <ProductEditDialog
                        editOpen={editOpen}
                        setEditOpen={setEditOpen}
                        selectedProduct={selectedProduct}
            />


        </ListView>
    );
};

export default ProductsList;
