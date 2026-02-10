import { useState } from "react";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import type { BranchAssignments } from "@/types";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BranchAssingmentTable } from "./components/branchAssingmentTable";
import { BranchAssingmentEditDialog } from "./components/branchAssingmentEditDialog";
import { BranchAssingmentAddButton } from "./components/branchAssingmentAddButton";

export default function BranchAssingment() {
  // ===== UI state =====
  const [editOpen, setEditOpen] = useState(false);
  const [selectedBranchAssingment, setSelectedBranchAssingment] = useState<BranchAssignments | null>(null);
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
          <h1 className="page-title">Branch Assignment List</h1>

          <div className="intro-row">
            <p>Manage your branch assignments here.</p>

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
                <BranchAssingmentAddButton />
              </div>
            </div>
          </div>

          {/* Table */}
          <BranchAssingmentTable
                      filters={searchQuery ? [{ field: "name", operator: "contains", value: searchQuery }] : []}
                      onEdit={(assignment) => {
                          setSelectedBranchAssingment(assignment);
                          setEditOpen(true);
                      }}
                  />
          {/* Edit dialog */}
          <BranchAssingmentEditDialog
                      editOpen={editOpen}
                      setEditOpen={setEditOpen}
                      selectedAssignment={selectedBranchAssingment}
                    />

    </ListView>
  );
}
