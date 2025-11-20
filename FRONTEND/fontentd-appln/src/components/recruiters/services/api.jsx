import axios from 'axios';

const API_BASE_URL = 'http://localhost:9090/api';

// Helper to get token
function getToken() {
  return localStorage.getItem('token');
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request if present
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- JOBS ---

export const fetchJobs = () => api.get('/jobs');
export const postJob = (job) => api.post('/jobs', job);
export const updateJob = (id, job) => api.put(`/jobs/${id}`, job);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);

// --- APPLICANTS ---

export const fetchApplicants = () => api.get('/applicants');
export const applyToJob = (formData) =>
  api.post('/applicants/apply', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const updateApplicantStatus = (id, status) =>
  api.put(`/applicants/${id}/status`, { status });

// --- ONBOARDING ---

export const fetchChecklist = (applicantId) =>
  api.get(`/onboarding/${applicantId}`);
export const assignChecklist = (applicantId, tasks) =>
  api.post(`/onboarding/${applicantId}`, tasks);

export default api;