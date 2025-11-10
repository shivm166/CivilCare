import React from 'react'
import SuperAdminSidebar from '../SuperAdminSidebar'
import { Outlet } from 'react-router-dom'

function SuperAdminLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* 1. Sidebar (Fixed on the left) */}
      <SuperAdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 2. Header (Fixed on top) */}
        <header className="w-full h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
          <h1 className="text-xl font-bold text-gray-800">Super Admin Panel</h1>
        </header>

        {/* 3. Main Content (Scrollable) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default SuperAdminLayout