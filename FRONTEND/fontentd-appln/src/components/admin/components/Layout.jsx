import { useState } from 'react'
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom'
import {
  Users,
  Calendar,
  FileText,
  TrendingUp,
  BookOpen,
  BarChart3,
  Menu,
  X,
  Home
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'EmployeeList', href: '/admin/employees', icon: Users },
  { name: 'Attendance', href: '/admin/attendance', icon: Calendar },
  { name: 'Leaves', href: '/admin/leaves', icon: FileText },
  { name: 'Performance', href: '/admin/performance', icon: TrendingUp },
  { name: 'Training', href: '/admin/training', icon: BookOpen },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-20 items-center justify-between px-6">
            <h1 className="text-2xl font-bold text-gray-900">HRMS</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-2 px-4 py-6">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-base font-medium rounded-lg ${isActive
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={`mr-4 h-6 w-6 ${isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-20 items-center px-6">
            <BarChart3 className="h-10 w-10 text-primary-600" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900">HRMS</h1>
          </div>
          <nav className="flex-1 space-y-2 px-4 py-6">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-base font-medium rounded-lg ${isActive
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <item.icon
                    className={`mr-4 h-6 w-6 ${isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-6 border-b border-gray-200 bg-white px-6 shadow-sm sm:gap-x-8 sm:px-8 lg:px-12">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-6 self-stretch lg:gap-x-8">
            <div className="flex flex-1 items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {navigation.find(item => location.pathname.startsWith(item.href))?.name || 'HRMS'}
              </h2>
            </div>
            <div className="flex items-center gap-x-6 lg:gap-x-8">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                  <span className="text-base font-medium text-white">HR</span>
                </div>
                <span className="text-base font-medium text-gray-700">HR Admin</span>
                <button
                  className="ml-4 bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200 transition font-medium"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
