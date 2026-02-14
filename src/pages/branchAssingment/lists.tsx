import { useRef, useState } from "react";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import type { Branch, BranchAssignments } from "@/types";
import { Calendar, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BranchAssingmentTable } from "./components/branchAssingmentTable";
import { BranchAssingmentEditDialog } from "./components/branchAssingmentEditDialog";
import { BranchAssingmentAddButton } from "./components/branchAssingmentAddButton";
import { useList } from "@refinedev/core";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function BranchAssingment() {
  // ===== UI state =====
  const [editOpen, setEditOpen] = useState(false);
  const [selectedBranchAssingment, setSelectedBranchAssingment] = useState<BranchAssignments | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("");
  const monthInputRef = useRef<HTMLInputElement>(null);

  const { query: branchesQuery } = useList<Branch>({
    resource: "branches",
    pagination: { pageSize: 100 },
  });
  const branches = branchesQuery.data?.data ?? [];

  // ===== Table filters =====
  const filters = [
    ...(searchQuery
      ? [
          {
            field: "name",
            operator: "contains" as const,
            value: searchQuery,
          },
        ]
      : []),
    ...(selectedBranchId !== "all"
      ? [
          {
            field: "branchId",
            operator: "eq" as const,
            value: selectedBranchId,
          },
        ]
      : []),
    ...(selectedMonth
      ? [
          {
            field: "assignedMonth",
            operator: "eq" as const,
            value: selectedMonth,
          },
        ]
      : []),
  ];
        

  return (
    // ===== Page layout =====
    <ListView>
      <div className="bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
      <Breadcrumb />

          {/* Heading */}
          <div className="intro-row">
            <div>
              <h1 className="page-title">Branch Assignment List</h1>
              <p>Manage your branch assignments here.</p>
            </div>

            {/* Actions */}
            <div className="actions-row">
              

              <div className="flex gap-2 w-full sm:w-auto">
                <BranchAssingmentAddButton />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-black">
              <div className="p-4 bg-gray-50/50 border-b border-gray-200">
                <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Search bar */}
                  <div className="w-full">
                    <div className="search-field">
                        <Search className="search-icon" />
                        <Input
                            type="text"
                            placeholder="Search by name..."
                            className="w-full pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                  </div>
                  {/* branch filter */}
                  <div className="w-full">
                    
                      <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Filter by branch" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Branches</SelectItem>
                          {branches.map((branch) => (
                            <SelectItem key={branch.id} value={String(branch.id)}>
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    
                  </div>
                  {/* Month filter*/}
                  <div className="w-full">
                    <div className="relative">
                      <Input
                        ref={monthInputRef}
                        className="w-full pr-10 month-input-no-native"
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        onClick={() => {
                          const input = monthInputRef.current as
                            | (HTMLInputElement & { showPicker?: () => void })
                            | null;
                          input?.showPicker?.();
                          input?.focus();
                        }}
                      >
                        <Calendar className="h-4 w-4 text-primary" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
      
              {/* Data Table */}
              <div className="overflow-x-auto">
                <BranchAssingmentTable
                    filters={filters}
                    onEdit={(assignment) => {
                        setSelectedBranchAssingment(assignment);
                        setEditOpen(true);
                    }}
                />
              </div>
            </div>

          {/* Edit dialog */}
          <BranchAssingmentEditDialog
                      editOpen={editOpen}
                      setEditOpen={setEditOpen}
                      selectedAssignment={selectedBranchAssingment}
                    />
        </div>
      </div>
    </ListView>
  );
}
