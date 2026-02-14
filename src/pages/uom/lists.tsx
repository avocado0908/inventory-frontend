import { useState } from "react";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Uom } from "@/types";
import { UomAddButton } from "./components/uom-add-button";
import { UomTable } from "./components/uom-table";
import { UomEditDialog } from "./components/uom-edit-dialog";

export default function UomList() {
  // ===== UI state =====
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUom, setSelectedUom] = useState<Uom | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // ===== Table filters =====
  const searchFilters = searchQuery
    ? [
        {
          field: "name",
          operator: "contains" as const,
          value: searchQuery,
        },
      ]
    : [];

  return (
    // ===== Page layout =====
    <ListView>
      <div className=" bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
      <Breadcrumb />
      

      <div className="intro-row">
        <div>
          <h1 className="page-title">UOM List</h1>
          <p>Manage your units of measure here.</p>
        </div>


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
            <UomAddButton />
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
          <UomTable
            filters={searchFilters}
            onEdit={(uom) => {
              setSelectedUom(uom);
              setEditOpen(true);
            }}
          />
        </div>
      </div>

      {/* Edit dialog */}
      <UomEditDialog
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        selectedUom={selectedUom}
      />
      </div>
      </div>
    </ListView>
  );
}
