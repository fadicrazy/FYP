import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ===== Auth API =====
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/me'),
};

// ===== Patients API =====
export const patientsAPI = {
  getAll: () => API.get('/patients'),
  getById: (id) => API.get(`/patients/${id}`),
  getMyProfile: () => API.get('/patients/my-profile'),
  create: (data) => API.post('/patients', data),
  update: (id, data) => API.put(`/patients/${id}`, data),
};

// ===== Vitals API =====
export const vitalsAPI = {
  record: (data) => API.post('/vitals', data),
  getByPatient: (patientId) => API.get(`/vitals/${patientId}`),
  getLatest: (patientId) => API.get(`/vitals/latest/${patientId}`),
};

// ===== Consultations API =====
export const consultationsAPI = {
  getAll: (params) => API.get('/consultations', { params }),
  getById: (id) => API.get(`/consultations/${id}`),
  getPending: () => API.get('/consultations/pending'),
  getMine: () => API.get('/consultations/my-consultations'),
  request: (data) => API.post('/consultations/request', data),
  accept: (id) => API.put(`/consultations/${id}/accept`),
  start: (id) => API.put(`/consultations/${id}/start`),
  complete: (id, data) => API.put(`/consultations/${id}/complete`, data),
  cancel: (id) => API.put(`/consultations/${id}/cancel`),
};

// ===== Prescriptions API =====
export const prescriptionsAPI = {
  getAll: () => API.get('/prescriptions'),
  getById: (id) => API.get(`/prescriptions/${id}`),
  getByPatient: (patientId) => API.get(`/prescriptions/patient/${patientId}`),
  create: (data) => API.post('/prescriptions', data),
};

// ===== Deliveries API =====
export const deliveriesAPI = {
  getAll: (params) => API.get('/deliveries', { params }),
  getById: (id) => API.get(`/deliveries/${id}`),
  create: (data) => API.post('/deliveries', data),
  updateStatus: (id, data) => API.put(`/deliveries/${id}/status`, data),
};

// ===== Admin API =====
export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getUsers: (role) => API.get('/admin/users', { params: role ? { role } : {} }),
  approveUser: (id) => API.put(`/admin/users/${id}/approve`),
  deactivateUser: (id) => API.put(`/admin/users/${id}/deactivate`),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  getActivity: () => API.get('/admin/activity'),
  getMonthlyStats: () => API.get('/admin/monthly-stats'),
};

// ===== Users API =====
export const usersAPI = {
  getAll: (role) => API.get('/users', { params: role ? { role } : {} }),
  getById: (id) => API.get(`/users/${id}`),
  update: (id, data) => API.put(`/users/${id}`, data),
};

// ===== Uploads API =====
export const uploadsAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return API.post('/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default API;
