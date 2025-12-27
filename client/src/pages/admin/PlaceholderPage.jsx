import React from 'react'
import AdminLayout from '../../components/admin/AdminLayout'

export default function PlaceholderPage({ title = 'Page', description = 'This page is coming soon' }) {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-1">{description}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 text-lg">This feature is under development and will be available soon.</p>
        </div>
      </div>
    </AdminLayout>
  )
}

