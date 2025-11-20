import { Link } from 'react-router-dom'
import { Plus, BookOpen } from 'lucide-react'

export default function TrainingList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Training & Development</h1>
          <p className="text-gray-600">Manage employee training programs</p>
        </div>
        <Link to="/admin/training/new" className="btn btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Assign Training
        </Link>
      </div>

      <div className="card">
        <div className="card-content">
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Training & Development</h3>
            <p className="text-gray-600">Training management functionality coming soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}
