import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (email: string, password: string) => {
    const response = await api.post('/api/auth/register', { email, password });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

// Companies API
export const companiesAPI = {
  getAll: async (search?: string, sector?: string) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (sector) params.append('sector', sector);
    const response = await api.get(`/api/companies?${params.toString()}`);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/api/companies/${id}`);
    return response.data;
  },
};

// Selections API
export const selectionsAPI = {
  save: async (companyIds: number[]) => {
    const response = await api.post('/api/user/selections', { company_ids: companyIds });
    return response.data;
  },

  get: async () => {
    const response = await api.get('/api/user/selections');
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  get: async () => {
    const response = await api.get('/api/dashboard');
    return response.data;
  },

  getCompanyInsights: async (companyId: number) => {
    const response = await api.get(`/api/dashboard/company/${companyId}/insights`);
    return response.data;
  },
};

export default api;
