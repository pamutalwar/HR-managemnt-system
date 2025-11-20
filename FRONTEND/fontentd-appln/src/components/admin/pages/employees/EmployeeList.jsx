import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { employeeAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function EmployeeList() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [pageSize] = useState(10)
  const [sortBy, setSortBy] = useState('id')
  const [sortDir, setSortDir] = useState('asc')
  const [filterDepartment, setFilterDepartment] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    fetchEmployees()
  }, [currentPage, sortBy, sortDir, searchTerm, filterDepartment, filterStatus])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const params = {
        page: currentPage,
        size: pageSize,
        sortBy,
        sortDir,
        ...(searchTerm && { search: searchTerm }),
        ...(filterDepartment && { department: filterDepartment }),
        ...(filterStatus && { status: filterStatus })
      }

      const response = await employeeAPI.getAll(params)
      setEmployees(response.data.content)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Error fetching employees:', error)
      toast.error('Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeAPI.delete(id)
        toast.success('Employee deleted successfully')
        fetchEmployees()
      } catch (error) {
        console.error('Error deleting employee:', error)
        toast.error('Failed to delete employee')
      }
    }
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortDir('asc')
    }
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-gray-100 text-gray-800',
      TERMINATED: 'bg-red-100 text-red-800',
      ON_LEAVE: 'bg-yellow-100 text-yellow-800'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status?.replace('_', ' ')}
      </span>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
          <p className="text-lg text-gray-600">Manage your organization's employees</p>
        </div>
        <Link
          to="/admin/employees/new"
          className="btn btn-primary px-6 py-3"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Employee
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-content p-8">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="input pl-10 py-3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Department Filter */}
            <select
              className="input py-3"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>

            {/* Status Filter */}
            <select
              className="input py-3"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="ON_LEAVE">On Leave</option>
              <option value="TERMINATED">Terminated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="card">
        <div className="card-content p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead className="table-header">
                    <tr>
                      <th
                        className="table-head cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('employeeId')}
                      >
                        Employee ID
                      </th>
                      <th
                        className="table-head cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('firstName')}
                      >
                        Name
                      </th>
                      <th
                        className="table-head cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('email')}
                      >
                        Email
                      </th>
                      <th
                        className="table-head cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('department')}
                      >
                        Department
                      </th>
                      <th
                        className="table-head cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('position')}
                      >
                        Position
                      </th>
                      <th
                        className="table-head cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('status')}
                      >
                        Status
                      </th>
                      <th className="table-head">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee) => (
                      <tr key={employee.id} className="table-row">
                        <td className="table-cell font-medium">{employee.employeeId}</td>
                        <td className="table-cell">
                          <div>
                            <div className="font-medium text-gray-900">
                              {employee.firstName} {employee.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{employee.phoneNumber}</div>
                          </div>
                        </td>
                        <td className="table-cell text-gray-900">{employee.email}</td>
                        <td className="table-cell text-gray-900">{employee.department}</td>
                        <td className="table-cell text-gray-900">{employee.position}</td>
                        <td className="table-cell">{getStatusBadge(employee.status)}</td>
                        <td className="table-cell">
                          <div className="flex items-center space-x-3">
                            <Link
                              to={`/employees/${employee.id}/edit`}
                              className="text-blue-600 hover:text-blue-900 p-2 rounded-md hover:bg-blue-50"
                            >
                              <Edit className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={() => handleDelete(employee.id)}
                              className="text-red-600 hover:text-red-900 p-2 rounded-md hover:bg-red-50"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-8 py-6 border-t border-gray-200">
                  <div className="text-base text-gray-700">
                    Page {currentPage + 1} of {totalPages}
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                      className="btn btn-outline px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                      disabled={currentPage === totalPages - 1}
                      className="btn btn-outline px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
