import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:9090/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }

    const message = error.response?.data?.error || error.response?.data?.message || 'An error occurred'
    toast.error(message)

    return Promise.reject(error)
  }
)

// Employee API
export const employeeAPI = {
  getAll: (params = {}) => api.get('/employees', { params }),
  getById: (id) => api.get(`/employees/${id}`),
  getByEmployeeId: (employeeId) => api.get(`/employees/employee-id/${employeeId}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
  getByDepartment: (department) => api.get(`/employees/department/${department}`),
  getByStatus: (status) => api.get(`/employees/status/${status}`),
  getStats: () => api.get('/employees/stats'),
  generateId: () => api.get('/employees/generate-id'),
}

// Attendance API
export const attendanceAPI = {
  getAll: (params = {}) => api.get('/attendance', { params }),
  getById: (id) => api.get(`/attendance/${id}`),
  getByEmployee: (employeeId) => api.get(`/attendance/employee/${employeeId}`),
  getByDate: (date) => api.get(`/attendance/date/${date}`),
  mark: (data) => api.post('/attendance/mark', data),
  update: (id, data) => api.put(`/attendance/${id}`, data),
  checkOut: (employeeId, date) => api.post('/attendance/checkout', null, {
    params: { employeeId, date }
  }),
  delete: (id) => api.delete(`/attendance/${id}`),
  getTodayStats: () => api.get('/attendance/stats/today'),
  getStatsByDate: (date) => api.get(`/attendance/stats/date/${date}`),
}

// Leave API
export const leaveAPI = {
  getAll: (params = {}) => api.get('/leaves', { params }),
  getById: (id) => api.get(`/leaves/${id}`),
  getByEmployee: (employeeId) => api.get(`/leaves/employee/${employeeId}`),
  request: (data) => api.post('/leaves/request', data),
  update: (id, data) => api.put(`/leaves/${id}`, data),
  approve: (id) => api.put(`/leaves/${id}/approve`),
  reject: (id, reason) => api.put(`/leaves/${id}/reject`, { rejectionReason: reason }),
  delete: (id) => api.delete(`/leaves/${id}`),
  getStats: () => api.get('/leaves/stats'),
}

// Performance API
export const performanceAPI = {
  getAll: (params = {}) => api.get('/performance', { params }),
  getById: (id) => api.get(`/performance/${id}`),
  getByEmployee: (employeeId) => api.get(`/performance/${employeeId}`),
  create: (data) => api.post('/performance', data),
  update: (id, data) => api.put(`/performance/${id}`, data),
  delete: (id) => api.delete(`/performance/${id}`),
  getStats: () => api.get('/performance/stats'),
}

// Training API
export const trainingAPI = {
  getAll: (params = {}) => api.get('/training', { params }),
  getById: (id) => api.get(`/training/${id}`),
  getByEmployee: (employeeId) => api.get(`/training/${employeeId}`),
  assign: (data) => api.post('/training/assign', data),
  update: (id, data) => api.put(`/training/${id}`, data),
  updateProgress: (id, progress) => api.put(`/training/${id}/progress`, { completionPercentage: progress }),
  delete: (id) => api.delete(`/training/${id}`),
  getStats: () => api.get('/training/stats'),
}

export default api
