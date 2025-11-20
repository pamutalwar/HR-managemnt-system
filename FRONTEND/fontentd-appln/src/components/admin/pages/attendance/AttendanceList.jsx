import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Calendar, Clock } from 'lucide-react'

export default function AttendanceList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600">Track and manage employee attendance</p>
        </div>
        <Link to="/admin/attendance/new" className="btn btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Mark Attendance
        </Link>
      </div>

      <div className="card">
        <div className="card-content">
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Attendance Management</h3>
            <p className="text-gray-600 mb-4">This module will contain attendance tracking functionality</p>
            <Link to="/admin/attendance/new" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
