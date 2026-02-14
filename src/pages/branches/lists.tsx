import { useState } from "react";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import type { Branch } from "@/types";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BranchTable } from "./components/BranchTable";
import { BranchAddButton } from "./components/BranchAddButton";
import { BranchEditDialog } from "./components/BranchEditDialog";

export default function BranchList() {
  // ===== UI state =====
  const [editOpen, setEditOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
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

        
            {/* Heading */} 
            <div className="intro-row">
              <div>
              <h1 className="page-title">Branch List</h1>
              <p>Manage your branch here.</p>
              </div>

              {/* Actions */}
              <div className="actions-row">
                <div className="flex gap-2 w-full sm:w-auto">
                  <BranchAddButton />
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
              <BranchTable
                filters={searchQuery ? [{ field: "name", operator: "contains", value: searchQuery }] : []}
                onEdit={(branch) => {
                  setSelectedBranch(branch);
                  setEditOpen(true);
                }}
              />
            </div>

            {/* Edit dialog */}
            <BranchEditDialog
              editOpen={editOpen}
              setEditOpen={setEditOpen}
              selectedBranch={selectedBranch}
            />
  
          </div>
        </div>
      </ListView>
    );
  }
  
