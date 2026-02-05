import { CreateButton } from "@/components/refine-ui/buttons/create"
import { DataTable } from "@/components/refine-ui/data-table/data-table"
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb"
import { ListView } from "@/components/refine-ui/views/list-view"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Product } from "@/types"
import { useList } from "@refinedev/core"
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table"
import {  Search } from "lucide-react"
import { useMemo, useState } from "react"
import type { Category } from "@/types";

const ProductsList = () => {
    const [SearchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categoryFilters = selectedCategory == 'all' ? []: [
        { field: 'category', 
            operator: 'eq' as const,
            value: selectedCategory
        }
    ];

    const searchFilters = SearchQuery ? [
        { field: 'name', 
            operator: 'contains' as const,
            value: SearchQuery
        }
    ] : [];

    const productTable = useTable<Product>({
        columns: useMemo<ColumnDef<Product>[]>(() => [
            {   
                id: 'category', 
                accessorKey: 'category.name', 
                size: 100 ,
                header: () => <p className="column-title ml-2">Category</p>,
                cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>
            },

            {   
                id: 'name',
                accessorKey: 'name',
                size: 300 ,
                header: () => <p className="column-title">Name</p>,
                cell: ({ getValue }) => <span className="truncate line-clamp-2">{getValue<string>()}</span>,
                filterFn: 'includesString'
            },
            {
                id: 'supplier',
                accessorKey: 'supplier.name',
                size: 100,
                header: () => <p className="column-title">Supplier</p>,
                cell: ({ getValue }) => <Badge variant="secondary">{getValue<string>()}</Badge>
            },
            {
                id: 'pkg',
                accessorKey: 'pkg',
                size: 100,
                header: () => <p className="column-title">PKG</p>,
                cell: ({ getValue }) => <span className="text-foreground">{getValue<number>()}</span>,
            },
            {
                id: 'uom',
                accessorKey: 'uom.name',
                size: 100,
                header: () => <p className="column-title">UOM</p>,
                cell: ({ getValue }) => <span className="text-foreground">{getValue<string>()}</span>,
            },
        ],[]),
        refineCoreProps: {
            resource: 'products',
            pagination: { pageSize: 10, mode: 'server'},
            filters: {
                permanent: [ ...categoryFilters, ...searchFilters ]
            },
            sorters: {
                initial: [
                    { field: 'id', order: 'asc'},
                ]
            },
        }
    });

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
            <p>Manage Products</p>

            <div className="actions-row">
                <div className="search-field">
                    <Search className="search-icon" />

                    <Input 
                        type="text"
                        placeholder="Search by name..."
                        className="pl-10 w-full"
                        value={SearchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>

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
                    <CreateButton />
                </div>
            </div>
        </div>

        <DataTable table={productTable} />
    </ListView>
  )
}

export default ProductsList