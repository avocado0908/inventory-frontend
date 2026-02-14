import { useState } from "react";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { CategoriesAddButton } from "@/pages/categories/components/categories-add-button";
import type { Category } from "@/types";
import { CategoriesTable } from "./components/categories-table";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CategoryEditDialog } from "./components/categoryEditDialog";

export default function CategoriesList() {
  // ===== UI state =====
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // ===== Table filters =====
  const searchFilters = searchQuery
        ? [
              {
                  field: "name",
                  operator: "contains" as const,
                  value: searchQuery,
              },
          ]: [];
        

  return (
    // ===== Page layout =====
    <ListView>
      <div className="bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
      <Breadcrumb />

          <div className="intro-row">
            <div>
              <h1 className="page-title">Categories List</h1>
              <p>Manage your categories here.</p>
            </div>
            
            {/* Actions */}
            <div className="actions-row">            
              <div className="flex gap-2 w-full sm:w-auto">
                <CategoriesAddButton />
              </div>
            </div>
          </div>


      {/* table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-black">
        {/* Search bar */}
        <div className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/50 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-1">
            <div className="relative w-full md:w-80">
              <div className="search-field">
                  <Search className="search-icon" />
                  <Input
                      type="text"
                      placeholder="Search by name..."
                      className="pl-10 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                  />
              </div>
            </div>
          </div>
        </div>
        {/* Data Table */}
        <div className="overflow-x-auto">
          <CategoriesTable
            filters={searchQuery ? [{ field: "name", operator: "contains", value: searchQuery }] : []}
            onEdit={(category) => {
              setSelectedCategory(category);
              setEditOpen(true);
            }}
          />
        </div>
      </div>

          {/* Edit dialog */}
          <CategoryEditDialog
            editOpen={editOpen}
            setEditOpen={setEditOpen}
            selectedCategory={selectedCategory}
          />
      </div>
      </div>
    </ListView>
  );
}
