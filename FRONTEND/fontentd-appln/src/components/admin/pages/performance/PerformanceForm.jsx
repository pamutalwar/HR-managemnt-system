import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Save, TrendingUp, User, Star, Target } from 'lucide-react'
import { performanceAPI, employeeAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function PerformanceForm() {
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
      reviewPeriodStart: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
      reviewPeriodEnd: new Date().toISOString().split('T')[0],
      status: 'DRAFT'
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
      await performanceAPI.create(data)
      toast.success('Performance review created successfully')
      navigate('/performance')
    } catch (error) {
      console.error('Error creating performance review:', error)
      toast.error(error.response?.data?.error || 'Failed to create performance review')
    } finally {
      setLoading(false)
    }
  }

  const RatingField = ({ name, label, register, errors }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label} *
      </label>
      <select
        className="input focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        {...register(name, { required: `${label} rating is required` })}
      >
        <option value="">Select Rating</option>
        <option value="1">1 - Poor</option>
        <option value="2">2 - Below Average</option>
        <option value="3">3 - Average</option>
        <option value="4">4 - Good</option>
        <option value="5">5 - Excellent</option>
      </select>
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <span className="mr-1">⚠</span>
          {errors[name].message}
        </p>
      )}
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/performance')}
          className="btn btn-outline"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Review</h1>
          <p className="text-gray-600">Add performance feedback and ratings</p>
        </div>
      </div>

      {/* Form */}
      <div className="card shadow-lg border-0">
        <div className="card-header bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
            Performance Review Information
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Fill in the performance review details below
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="card-content space-y-8 p-8">
          {/* Employee Selection */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
              <User className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Employee & Review Period</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                    className="input focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                  Review Period Start *
                </label>
                <input
                  type="date"
                  className="input focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  {...register('reviewPeriodStart', { required: 'Review period start is required' })}
                />
                {errors.reviewPeriodStart && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.reviewPeriodStart.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Review Period End *
                </label>
                <input
                  type="date"
                  className="input focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  {...register('reviewPeriodEnd', { required: 'Review period end is required' })}
                />
                {errors.reviewPeriodEnd && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.reviewPeriodEnd.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Performance Ratings */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
              <Star className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Performance Ratings</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <RatingField
                name="qualityOfWork"
                label="Quality of Work"
                register={register}
                errors={errors}
              />
              <RatingField
                name="productivity"
                label="Productivity"
                register={register}
                errors={errors}
              />
              <RatingField
                name="communication"
                label="Communication"
                register={register}
                errors={errors}
              />
              <RatingField
                name="teamwork"
                label="Teamwork"
                register={register}
                errors={errors}
              />
              <RatingField
                name="leadership"
                label="Leadership"
                register={register}
                errors={errors}
              />
              <RatingField
                name="punctuality"
                label="Punctuality"
                register={register}
                errors={errors}
              />
            </div>
          </div>

          {/* Feedback Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
              <Target className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Detailed Feedback</h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Strengths
                </label>
                <textarea
                  rows={4}
                  className="input focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                  placeholder="Highlight the employee's key strengths and achievements"
                  {...register('strengths')}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Areas for Improvement
                </label>
                <textarea
                  rows={4}
                  className="input focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                  placeholder="Identify areas where the employee can improve"
                  {...register('areasForImprovement')}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Goals for Next Period
                </label>
                <textarea
                  rows={4}
                  className="input focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                  placeholder="Set specific goals and objectives for the next review period"
                  {...register('goals')}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Additional Feedback
                </label>
                <textarea
                  rows={4}
                  className="input focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                  placeholder="Any additional comments or feedback"
                  {...register('feedback')}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Reviewed By *
                </label>
                <input
                  type="text"
                  className="input focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter reviewer's name"
                  {...register('reviewedBy', { required: 'Reviewer name is required' })}
                />
                {errors.reviewedBy && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.reviewedBy.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/performance')}
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
              Create Performance Review
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
