import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Save, BookOpen, User, Calendar, MapPin, Clock } from 'lucide-react'
import { trainingAPI, employeeAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function TrainingForm() {
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
      trainingType: 'TECHNICAL',
      status: 'ASSIGNED',
      completionPercentage: 0
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
      await trainingAPI.assign(data)
      toast.success('Training assigned successfully')
      navigate('/training')
    } catch (error) {
      console.error('Error assigning training:', error)
      toast.error(error.response?.data?.error || 'Failed to assign training')
    } finally {
      setLoading(false)
    }
  }

  const startDate = watch('startDate')
  const endDate = watch('endDate')

  // Calculate duration in days
  const calculateDuration = () => {
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
          onClick={() => navigate('/training')}
          className="btn btn-outline"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assign Training</h1>
          <p className="text-gray-600">Assign training programs to employees</p>
        </div>
      </div>

      {/* Form */}
      <div className="card shadow-lg border-0">
        <div className="card-header bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-teal-600" />
            Training Assignment Information
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Fill in the training assignment details below
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="card-content space-y-8 p-8">
          {/* Employee Selection */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
              <User className="h-5 w-5 text-teal-600" />
              <h3 className="text-lg font-semibold text-gray-900">Employee & Training Details</h3>
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
                    className="input focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                  Training Name *
                </label>
                <input
                  type="text"
                  className="input focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Enter training program name"
                  {...register('trainingName', { required: 'Training name is required' })}
                />
                {errors.trainingName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.trainingName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Training Type *
                </label>
                <select
                  className="input focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  {...register('trainingType', { required: 'Training type is required' })}
                >
                  <option value="TECHNICAL">Technical</option>
                  <option value="SOFT_SKILLS">Soft Skills</option>
                  <option value="COMPLIANCE">Compliance</option>
                  <option value="LEADERSHIP">Leadership</option>
                  <option value="SAFETY">Safety</option>
                  <option value="ORIENTATION">Orientation</option>
                  <option value="CERTIFICATION">Certification</option>
                </select>
                {errors.trainingType && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.trainingType.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Instructor
                </label>
                <input
                  type="text"
                  className="input focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Enter instructor name"
                  {...register('instructor')}
                />
              </div>
            </div>
          </div>

          {/* Training Schedule */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
              <Calendar className="h-5 w-5 text-teal-600" />
              <h3 className="text-lg font-semibold text-gray-900">Training Schedule</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  className="input focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  {...register('startDate')}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  className="input focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  {...register('endDate')}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Duration (Hours)
                </label>
                <input
                  type="number"
                  min="1"
                  className="input focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Enter duration in hours"
                  {...register('durationHours')}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Duration (Days)
                </label>
                <div className="input bg-gray-50 flex items-center justify-center font-semibold text-lg text-gray-700">
                  {calculateDuration()} {calculateDuration() === 1 ? 'day' : 'days'}
                </div>
              </div>
            </div>
          </div>

          {/* Training Location & Details */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
              <MapPin className="h-5 w-5 text-teal-600" />
              <h3 className="text-lg font-semibold text-gray-900">Location & Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  className="input focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Enter training location"
                  {...register('location')}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Assigned By
                </label>
                <input
                  type="text"
                  className="input focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Enter assigner's name"
                  {...register('assignedBy')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Training Description
              </label>
              <textarea
                rows={4}
                className="input focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                placeholder="Provide a detailed description of the training program"
                {...register('description')}
              />
            </div>
          </div>

          {/* Training Goals & Objectives */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
              <BookOpen className="h-5 w-5 text-teal-600" />
              <h3 className="text-lg font-semibold text-gray-900">Training Objectives</h3>
            </div>
            <div className="space-y-6">
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
                <h4 className="text-sm font-semibold text-teal-800 mb-3">Training Benefits</h4>
                <ul className="text-sm text-teal-700 space-y-2">
                  <li>• Enhance employee skills and knowledge</li>
                  <li>• Improve job performance and productivity</li>
                  <li>• Support career development and growth</li>
                  <li>• Ensure compliance with industry standards</li>
                  <li>• Foster innovation and best practices</li>
                </ul>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Additional Notes
                </label>
                <textarea
                  rows={3}
                  className="input focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                  placeholder="Any additional notes or special requirements"
                  {...register('notes')}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/training')}
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
              Assign Training
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
