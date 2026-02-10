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
      <Breadcrumb />
      <h1 className="page-title">Categories List</h1>

          <div className="intro-row">
            <p>Manage your categories here.</p>

            {/* Actions */}
            <div className="actions-row">
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

              <div className="flex gap-2 w-full sm:w-auto">
                <CategoriesAddButton />
              </div>
            </div>
          </div>

          {/* Table */}
          <CategoriesTable
            filters={searchQuery ? [{ field: "name", operator: "contains", value: searchQuery }] : []}
            onEdit={(category) => {
              setSelectedCategory(category);
              setEditOpen(true);
            }}
          />

          {/* Edit dialog */}
          <CategoryEditDialog
            editOpen={editOpen}
            setEditOpen={setEditOpen}
            selectedCategory={selectedCategory}
          />

    </ListView>
  );
}
