import { ListView } from '@/components/refine-ui/views/list-view'
import { Input } from '@/components/ui/input'
import { Supplier } from '@/types'
import { Search } from 'lucide-react'
import React, { useState } from 'react'
import { SupplierAddButton } from './components/supplierAddButton'
import { SupplierTable } from './components/supplierTable'
import { SupplierEditDialog } from './components/supplierEditDialog'
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'

const SuppliersList = () => {
    // ===== UI state =====
    const [editOpen, setEditOpen] = useState(false);
      const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
      const [searchQuery, setSearchQuery] = useState("");
    
      // ===== Table filters =====
      const searchFilters = searchQuery
            ? [
                  {
                      field: "name",
                      operator: "contains" as const,
                      value: searchQuery,
                  },
              ] : [];

  return (
    // ===== Page layout =====
    <ListView>
        <div className="bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
            <Breadcrumb />
        
      {/* Heading */}
        <div className='intro-row'>
            <div>
                <h1 className='page-title'>Supplier List</h1>
                <p>Manage your categories here.</p>
            </div>

            {/* Actions */}
            <div className="actions-row">
              <div className="flex gap-2 w-full sm:w-auto">
                <SupplierAddButton />
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
            <SupplierTable
                filters={searchQuery ? [{ field: "name", operator: "contains", value: searchQuery }] : []}
                onEdit={(supplier) => {
                    setSelectedSupplier(supplier);
                    setEditOpen(true);
                }}
            />
          </div>
        </div>
        
        {/* Edit dialog */}
        <SupplierEditDialog
                    editOpen={editOpen}
                    setEditOpen={setEditOpen}
                    selectedSupplier={selectedSupplier}
                  />
            </div>
        </div>
    </ListView>
  )
}

export default SuppliersList
