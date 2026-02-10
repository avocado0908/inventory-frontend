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
        <Breadcrumb />
        <h1 className="page-title">Branch List</h1>
  
            <div className="intro-row">
              <p>Manage your branch here.</p>
  
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
                  <BranchAddButton />
                </div>
              </div>
            </div>
  
            {/* Table */}
            <BranchTable
              filters={searchQuery ? [{ field: "name", operator: "contains", value: searchQuery }] : []}
              onEdit={(branch) => {
                setSelectedBranch(branch);
                setEditOpen(true);
              }}
            />

            {/* Edit dialog */}
            <BranchEditDialog
              editOpen={editOpen}
              setEditOpen={setEditOpen}
              selectedBranch={selectedBranch}
            />
  
            
      </ListView>
    );
  }
  
