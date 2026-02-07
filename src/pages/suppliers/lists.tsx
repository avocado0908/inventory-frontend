import { ListView } from '@/components/refine-ui/views/list-view'
import { Input } from '@/components/ui/input'
import { Supplier } from '@/types'
import { Search } from 'lucide-react'
import React, { useState } from 'react'
import { SupplierAddButton } from './components/supplierAddButton'
import { SupplierTable } from './components/supplierTable'
import { SupplierEditDialog } from './components/supplierEditDialog'

const SuppliersList = () => {
    const [editOpen, setEditOpen] = useState(false);
      const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
      const [searchQuery, setSearchQuery] = useState("");
    
      const searchFilters = searchQuery
            ? [
                  {
                      field: "name",
                      operator: "contains" as const,
                      value: searchQuery,
                  },
              ] : [];

  return (
    <ListView>
        <h1 className='page-title'>Supplier List</h1>

        <div className='intro-row'>
            <p>Manage your categories here.</p>

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
                <SupplierAddButton />
              </div>
            </div>
        </div>

        <SupplierTable
            filters={searchQuery ? [{ field: "name", operator: "contains", value: searchQuery }] : []}
            onEdit={(supplier) => {
                setSelectedSupplier(supplier);
                setEditOpen(true);
            }}
        />
        <SupplierEditDialog
                    editOpen={editOpen}
                    setEditOpen={setEditOpen}
                    selectedSupplier={selectedSupplier}
                  />
    </ListView>
  )
}

export default SuppliersList