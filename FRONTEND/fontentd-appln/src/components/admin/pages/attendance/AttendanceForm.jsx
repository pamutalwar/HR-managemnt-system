import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Save, Clock, Calendar, User, MapPin } from 'lucide-react'
import { attendanceAPI, employeeAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function AttendanceForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [employees, setEmployees] = useState([])
  const [loadingEmployees, setLoadingEmployees] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    defaultValues: {
      attendanceDate: new Date().toISOString().split('T')[0],
      status: 'PRESENT'
    }
  })

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true)
      const response = await employeeAPI.getAll()
      setEmployees(response.data.content || response.data || [])
    } catch (error) {
      console.error('Error fetching employees:', error)
      toast.error('Failed to load employees')
    } finally {
      setLoadingEmployees(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      await attendanceAPI.mark(data)
      toast.success('Attendance marked successfully')
      navigate('/attendance')
    } catch (error) {
      console.error('Error marking attendance:', error)
      toast.error(error.response?.data?.error || 'Failed to mark attendance')
    } finally {
      setLoading(false)
    }
  }

  const selectedStatus = watch('status')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/attendance')}
          className="btn btn-outline"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
          <p className="text-gray-600">Record employee attendance for today</p>
        </div>
      </div>

      {/* Form */}
      <div className="card shadow-lg border-0">
        <div className="card-header bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-green-600" />
            Attendance Information
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Fill in the attendance details below
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="card-content space-y-8 p-8">
          {/* Employee Selection */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
              <User className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Employee Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Employee *
                </label>
                {loadingEmployees ? (
                  <div className="input flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    <span className="ml-2 text-gray-500">Loading employees...</span>
                  </div>
                ) : (
                  <select
                    className="input focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    {...register('employeeId', { required: 'Employee is required' })}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.employeeId} - {employee.firstName} {employee.lastName}
                      </option>
                    ))}
                  </select>
                )}
                {errors.employeeId && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.employeeId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Attendance Date *
                </label>
                <input
                  type="date"
                  className="input focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  {...register('attendanceDate', { required: 'Attendance date is required' })}
                />
                {errors.attendanceDate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.attendanceDate.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Attendance Status */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
              <Clock className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Attendance Status</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Status *
                </label>
                <select
                  className="input focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  {...register('status', { required: 'Status is required' })}
                >
                  <option value="PRESENT">Present</option>
                  <option value="ABSENT">Absent</option>
                  <option value="LATE">Late</option>
                  <option value="HALF_DAY">Half Day</option>
                  <option value="WORK_FROM_HOME">Work From Home</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.status.message}
                  </p>
                )}
              </div>

              {(selectedStatus === 'PRESENT' || selectedStatus === 'LATE' || selectedStatus === 'WORK_FROM_HOME') && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Check-in Time
                  </label>
                  <input
                    type="time"
                    className="input focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    {...register('checkInTime')}
                  />
                </div>
              )}

              {selectedStatus !== 'ABSENT' && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Check-out Time
                  </label>
                  <input
                    type="time"
                    className="input focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    {...register('checkOutTime')}
                  />
                </div>
              )}

              {selectedStatus === 'WORK_FROM_HOME' && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Work Location
                  </label>
                  <input
                    type="text"
                    className="input focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter work location"
                    {...register('workLocation')}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
              <Calendar className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Notes
              </label>
              <textarea
                rows={4}
                className="input focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                placeholder="Add any additional notes or comments"
                {...register('notes')}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/attendance')}
              className="btn btn-secondary px-6 py-3 text-base font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary px-8 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-shadow"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-5 w-5 mr-2" />
              )}
              Mark Attendance
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
