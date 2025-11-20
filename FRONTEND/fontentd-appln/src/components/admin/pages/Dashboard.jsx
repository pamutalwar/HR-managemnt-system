import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Calendar,
  FileText,
  TrendingUp,
  Plus,
  Clock,
  CheckCircle
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { employeeAPI, attendanceAPI, leaveAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const [stats, setStats] = useState({
    employees: {},
    attendance: {},
    leaves: {}
  })
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch all stats in parallel
const [employeeStats, attendanceStats, leaveStats] = await Promise.all([
        employeeAPI.getStats(),
        attendanceAPI.getTodayStats(),
        leaveAPI.getStats()
      ])

      setStats({
        employees: employeeStats.data,
        attendance: attendanceStats.data,
        leaves: leaveStats.data
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }
  const statCards = [
    {
      title: 'Total Employees',
      value: stats.employees.totalEmployees || 0,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Present Today',
      value: stats.attendance.present || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Pending Leaves',
      value: stats.leaves.pending || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      change: '-2%',
      changeType: 'negative'
    },
    {
      title: 'Active Training',
      value: 15,
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+8%',
      changeType: 'positive'
    }
  ]

  const attendanceData = [
    { name: 'Present', value: stats.attendance.present || 0, color: '#10b981' },
    { name: 'Absent', value: stats.attendance.absent || 0, color: '#ef4444' },
    { name: 'Late', value: stats.attendance.late || 0, color: '#f59e0b' },
    { name: 'WFH', value: stats.attendance.workFromHome || 0, color: '#8b5cf6' }
  ]

  // Calculate total attendance for better visualization
  const totalAttendance = attendanceData.reduce((sum, item) => sum + item.value, 0)

  const departmentData = [
    { name: 'Engineering', employees: 45, performance: 92 },
    { name: 'Marketing', employees: 23, performance: 88 },
    { name: 'Sales', employees: 34, performance: 85 },
    { name: 'HR', employees: 12, performance: 95 },
    { name: 'Finance', employees: 18, performance: 90 }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">HR Dashboard</h1>
          <p className="text-lg text-gray-600">Welcome back! Here's what's happening in your organization.</p>
        </div>
        <div className="flex space-x-4">
          <Link
            to="/employees/new"
            className="btn btn-primary px-6 py-3"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Employee
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat, index) => (
          <div key={index} className="card">
            <div className="card-content p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">from last month</span>
                  </div>
                </div>
                <div className={`p-4 rounded-full ${stat.color}`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Attendance Chart */}
        <div className="card">
          <div className="card-header p-8 pb-4">
            <h3 className="text-xl font-semibold">Today's Attendance</h3>
            <p className="text-base text-gray-600 mt-2">Real-time attendance overview</p>
          </div>
          <div className="card-content px-8 pb-8">
            {totalAttendance > 0 ? (
              <>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={attendanceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {attendanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-6 mt-6">
                  {attendanceData.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-base text-gray-600">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Attendance Data</h4>
                  <p className="text-gray-600">No attendance records found for today.</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Attendance data will appear here once employees mark their attendance.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Department Performance */}
        <div className="card">
          <div className="card-header p-8 pb-4">
            <h3 className="text-xl font-semibold">Department Overview</h3>
            <p className="text-base text-gray-600 mt-2">Employee count and performance by department</p>
          </div>
          <div className="card-content px-8 pb-8">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="employees" fill="#3b82f6" name="Employees" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="card">
          <div className="card-header p-8 pb-4">
            <h3 className="text-xl font-semibold">Quick Actions</h3>
          </div>
          <div className="card-content px-8 pb-8">
            <div className="grid grid-cols-2 gap-6">
              <Link
                to="/attendance/new"
                className="flex items-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Calendar className="h-10 w-10 text-blue-500 mr-4" />
                <div>
                  <p className="font-semibold text-base">Mark Attendance</p>
                  <p className="text-sm text-gray-600 mt-1">Record employee attendance</p>
                </div>
              </Link>
              <Link
                to="/leaves/new"
                className="flex items-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileText className="h-10 w-10 text-green-500 mr-4" />
                <div>
                  <p className="font-semibold text-base">Leave Request</p>
                  <p className="text-sm text-gray-600 mt-1">Submit leave application</p>
                </div>
              </Link>
              <Link
                to="/performance/new"
                className="flex items-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <TrendingUp className="h-10 w-10 text-purple-500 mr-4" />
                <div>
                  <p className="font-semibold text-base">Performance Review</p>
                  <p className="text-sm text-gray-600 mt-1">Add performance feedback</p>
                </div>
              </Link>
              <Link
                to="/training/new"
                className="flex items-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users className="h-10 w-10 text-orange-500 mr-4" />
                <div>
                  <p className="font-semibold text-base">Assign Training</p>
                  <p className="text-sm text-gray-600 mt-1">Schedule employee training</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header p-8 pb-4">
            <h3 className="text-xl font-semibold">Recent Activity</h3>
          </div>
          <div className="card-content px-8 pb-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-gray-900">John Doe marked attendance</p>
                  <p className="text-sm text-gray-500 mt-1">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-gray-900">Sarah Smith submitted leave request</p>
                  <p className="text-sm text-gray-500 mt-1">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-gray-900">Performance review completed for Mike Johnson</p>
                  <p className="text-sm text-gray-500 mt-1">3 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-gray-900">New employee onboarding started</p>
                  <p className="text-sm text-gray-500 mt-1">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
