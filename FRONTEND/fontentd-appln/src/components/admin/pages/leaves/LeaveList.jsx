import { Link } from 'react-router-dom'
import { Plus, FileText } from 'lucide-react'

export default function LeaveList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-600">Manage employee leave requests</p>
        </div>
        <Link to="/admin/leaves/new" className="btn btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Request Leave
        </Link>
      </div>

      <div className="card">
        <div className="card-content">
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Leave Management</h3>
            <p className="text-gray-600">Leave management functionality coming soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}
