import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Save, FileText, Calendar, User, Clock } from 'lucide-react'
import { leaveAPI, employeeAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function LeaveForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [employees, setEmployees] = useState([])
  const [loadingEmployees, setLoadingEmployees] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      leaveType: 'ANNUAL',
      status: 'PENDING'
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
      await leaveAPI.request(data)
      toast.success('Leave request submitted successfully')
      navigate('/leaves')
    } catch (error) {
      console.error('Error submitting leave request:', error)
      toast.error(error.response?.data?.error || 'Failed to submit leave request')
    } finally {
      setLoading(false)
    }
  }

  const startDate = watch('startDate')
  const endDate = watch('endDate')

  // Calculate number of days
  const calculateDays = () => {
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const diffTime = Math.abs(end - start)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      return diffDays
    }
    return 0
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/leaves')}
          className="btn btn-outline"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Request Leave</h1>
          <p className="text-gray-600">Submit a new leave request</p>
        </div>
      </div>

      {/* Form */}
      <div className="card shadow-lg border-0">
        <div className="card-header bg-gradient-to-r from-orange-50 to-amber-50 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-orange-600" />
            Leave Request Information
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Fill in the leave request details below
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="card-content space-y-8 p-8">
          {/* Employee Selection */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
              <User className="h-5 w-5 text-orange-600" />
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
                    className="input focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                <label className="block text-sm font-semibold text-gray-700">
                  Leave Type *
                </label>
                <select
                  className="input focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  {...register('leaveType', { required: 'Leave type is required' })}
                >
                  <option value="ANNUAL">Annual Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="MATERNITY">Maternity Leave</option>
                  <option value="PATERNITY">Paternity Leave</option>
                  <option value="PERSONAL">Personal Leave</option>
                  <option value="EMERGENCY">Emergency Leave</option>
                  <option value="UNPAID">Unpaid Leave</option>
                </select>
                {errors.leaveType && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.leaveType.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Leave Dates */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
              <Calendar className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Leave Dates</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Start Date *
                </label>
                <input
                  type="date"
                  className="input focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  {...register('startDate', { required: 'Start date is required' })}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  End Date *
                </label>
                <input
                  type="date"
                  className="input focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  {...register('endDate', { required: 'End date is required' })}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.endDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Total Days
                </label>
                <div className="input bg-gray-50 flex items-center justify-center font-semibold text-lg text-gray-700">
                  {calculateDays()} {calculateDays() === 1 ? 'day' : 'days'}
                </div>
              </div>
            </div>
          </div>

          {/* Leave Details */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
              <FileText className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Leave Details</h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Reason for Leave *
                </label>
                <textarea
                  rows={4}
                  className="input focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                  placeholder="Please provide a detailed reason for your leave request"
                  {...register('reason', { required: 'Reason is required' })}
                />
                {errors.reason && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.reason.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Additional Comments
                </label>
                <textarea
                  rows={3}
                  className="input focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                  placeholder="Any additional information or special requests"
                  {...register('comments')}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Emergency Contact (if applicable)
                </label>
                <input
                  type="text"
                  className="input focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Emergency contact person and phone number"
                  {...register('emergencyContact')}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/leaves')}
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
              Submit Leave Request
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
