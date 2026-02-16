import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { ListView } from '@/components/refine-ui/views/list-view'
import React from 'react'
import { BranchAssingmentAddButton } from '../branchAssingment/components/branchAssingmentAddButton'
import { StockcountTable } from './components/stockcount-table'
import { PreviousStockcountTable } from './components/previous-stockcount-table'

const stockcount2 = () => {
  const currentMonth = new Date().toISOString().slice(0, 7);

  return (
    <ListView>
      <div className="bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <Breadcrumb />

            {/* Heading */}
            <div className="intro-row">
              <div>
                <h1 className="page-title">Stock Count Assignments</h1>
                <p>Welcome to the Stock Count Page</p>
              </div>
            </div>

            {/* This month stock Count */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-black">
              <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 m-4'>
                <h2 className='text-lg font-bold'>This month's stock count</h2>
                <div className="actions-row">
                  <div className="flex gap-2 w-full sm:w-auto">
                    <BranchAssingmentAddButton />
                  </div>
                  </div>
              </div>
              <div className="overflow-x-auto">
                <StockcountTable month={currentMonth} />
              </div>
            </div>

            {/* Previous stock Count */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-black">
              <div className='m-4'>
                <h2 className='text-lg font-bold'>Previous stock counts</h2>
              </div>
              <div className="overflow-x-auto">
                <PreviousStockcountTable currentMonth={currentMonth} />
              </div>
            </div>

        </div>
      </div>
    </ListView>
  )
}

export default stockcount2
