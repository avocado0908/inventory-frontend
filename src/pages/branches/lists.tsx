import { useState } from "react";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import type { Branch } from "@/types";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BranchTable } from "./components/BranchTable";
import { BranchAddButton } from "./components/BranchAddButton";

export default function BranchList() {
  const [editOpen, setEditOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
  
    const searchFilters = searchQuery
          ? [
                {
                    field: "name",
                    operator: "contains" as const,
                    value: searchQuery,
                },
            ]: [];
          
  
    return (
      <ListView>
        <Breadcrumb />
        <h1 className="page-title">Branch List</h1>
  
            <div className="intro-row">
              <p>Manage your brance here.</p>
  
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
  
            <BranchTable
              filters={searchQuery ? [{ field: "name", operator: "contains", value: searchQuery }] : []}
              onEdit={(branch) => {
                setSelectedBranch(branch);
                setEditOpen(true);
              }}
            />
  
            
      </ListView>
    );
  }
  