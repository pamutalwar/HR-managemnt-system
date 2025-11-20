import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Save, RefreshCw, User, Briefcase, MapPin, Calendar } from 'lucide-react'
import { employeeAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function EmployeeForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(isEdit)
  const [generatingId, setGeneratingId] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm()

  useEffect(() => {
    if (isEdit) {
      fetchEmployee()
    } else {
      // Auto-generate employee ID for new employees
      generateEmployeeId()
    }
  }, [id, isEdit])

  const generateEmployeeId = async () => {
    try {
      setGeneratingId(true)
      const response = await employeeAPI.generateId()
      setValue('employeeId', response.data.employeeId)
    } catch (error) {
      console.error('Error generating employee ID:', error)
      toast.error('Failed to generate employee ID')
    } finally {
      setGeneratingId(false)
    }
  }

  const fetchEmployee = async () => {
    try {
      setInitialLoading(true)
      const response = await employeeAPI.getById(id)
      const employee = response.data

      // Set form values
      Object.keys(employee).forEach(key => {
        setValue(key, employee[key])
      })
    } catch (error) {
      console.error('Error fetching employee:', error)
      toast.error('Failed to load employee data')
      navigate('/employees')
    } finally {
      setInitialLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)

      if (isEdit) {
        await employeeAPI.update(id, data)
        toast.success('Employee updated successfully')
      } else {
        await employeeAPI.create(data)
        toast.success('Employee created successfully')
      }

      navigate('/employees')
    } catch (error) {
      console.error('Error saving employee:', error)
      toast.error(error.response?.data?.error || 'Failed to save employee')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/employees')}
          className="btn btn-outline"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Employee' : 'Add New Employee'}
          </h1>
          <p className="text-gray-600">
            {isEdit ? 'Update employee information' : 'Fill in the details to add a new employee'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="card shadow-lg border-0">
        <div className="card-header bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            Employee Information
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {isEdit ? 'Update employee details below' : 'Fill in the employee details below'}
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="card-content space-y-8 p-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
              <User className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Employee ID *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    className="input bg-gray-50 cursor-not-allowed"
                    readOnly={!isEdit}
                    {...register('employeeId', {
                      required: 'Employee ID is required',
                      pattern: {
                        value: /^[A-Z0-9]+$/,
                        message: 'Employee ID should contain only uppercase letters and numbers'
                      }
                    })}
                  />
                  {!isEdit && (
                    <button
                      type="button"
                      onClick={generateEmployeeId}
                      disabled={generatingId}
                      className="btn btn-outline px-3 py-2 min-w-[44px] flex items-center justify-center"
                      title="Generate new Employee ID"
                    >
                      {generatingId ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
                {errors.employeeId && (
                  <p className="mt-1 text-sm text-red-600">{errors.employeeId.message}</p>
                )}
                {!isEdit && (
                  <p className="text-xs text-gray-500">Employee ID is auto-generated. Click refresh to generate a new one.</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Status
                </label>
                <select
                  className="input focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...register('status')}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="ON_LEAVE">On Leave</option>
                  <option value="TERMINATED">Terminated</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  First Name *
                </label>
                <input
                  type="text"
                  className="input focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter first name"
                  {...register('firstName', { required: 'First name is required' })}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Last Name *
                </label>
                <input
                  type="text"
                  className="input focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter last name"
                  {...register('lastName', { required: 'Last name is required' })}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  className="input focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="input focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter phone number"
                  {...register('phoneNumber')}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Birth Date
                </label>
                <input
                  type="date"
                  className="input focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...register('birthDate')}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Hire Date *
                </label>
                <input
                  type="date"
                  className="input focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...register('hireDate', { required: 'Hire date is required' })}
                />
                {errors.hireDate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.hireDate.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Work Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
              <Briefcase className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Work Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Department *
                </label>
                <select
                  className="input focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...register('department', { required: 'Department is required' })}
                >
                  <option value="">Select Department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                </select>
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.department.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Position *
                </label>
                <input
                  type="text"
                  className="input focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter job position"
                  {...register('position', { required: 'Position is required' })}
                />
                {errors.position && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.position.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Salary
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    className="input pl-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    {...register('salary', {
                      min: { value: 0, message: 'Salary must be positive' }
                    })}
                  />
                </div>
                {errors.salary && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.salary.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
              <MapPin className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Address Information</h3>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Address
              </label>
              <textarea
                rows={4}
                className="input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Enter full address"
                {...register('address')}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/employees')}
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
              {isEdit ? 'Update Employee' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
