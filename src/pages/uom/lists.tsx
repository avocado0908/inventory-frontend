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
      <Breadcrumb />
      <h1 className="page-title">UOM List</h1>

      <div className="intro-row">
        <p>Manage your units of measure here.</p>

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

      {/* Table */}
      <UomTable
        filters={searchFilters}
        onEdit={(uom) => {
          setSelectedUom(uom);
          setEditOpen(true);
        }}
      />

      {/* Edit dialog */}
      <UomEditDialog
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        selectedUom={selectedUom}
      />
    </ListView>
  );
}
