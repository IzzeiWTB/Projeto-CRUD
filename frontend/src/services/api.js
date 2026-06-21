import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request Interceptor: Inject JWT token if available
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

// Response Interceptor: Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password })
    return response.data
  }
}

export const userService = {
  getAll: async () => {
    const response = await api.get('/users')
    return response.data
  },
  getById: async (id) => {
    const response = await api.get(`/users/${id}`)
    return response.data
  },
  create: async (data) => {
    const response = await api.post('/users', data)
    return response.data
  },
  update: async (id, data) => {
    const response = await api.put(`/users/${id}`, data)
    return response.data
  },
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`)
    return response.data
  }
}

export const carService = {
  getAll: async () => {
    const response = await api.get('/cars')
    return response.data
  },
  getById: async (id) => {
    const response = await api.get(`/cars/${id}`)
    return response.data
  },
  create: async (data) => {
    const response = await api.post('/cars', data)
    return response.data
  },
  update: async (id, data) => {
    const response = await api.put(`/cars/${id}`, data)
    return response.data
  },
  delete: async (id) => {
    const response = await api.delete(`/cars/${id}`)
    return response.data
  }
}

export const motorcycleService = {
  getAll: async () => {
    const response = await api.get('/motorcycles')
    return response.data
  },
  getById: async (id) => {
    const response = await api.get(`/motorcycles/${id}`)
    return response.data
  },
  create: async (data) => {
    const response = await api.post('/motorcycles', data)
    return response.data
  },
  update: async (id, data) => {
    const response = await api.put(`/motorcycles/${id}`, data)
    return response.data
  },
  delete: async (id) => {
    const response = await api.delete(`/motorcycles/${id}`)
    return response.data
  }
}

export const clothingBrandService = {
  getAll: async () => {
    const response = await api.get('/clothing-brands')
    return response.data
  },
  getById: async (id) => {
    const response = await api.get(`/clothing-brands/${id}`)
    return response.data
  },
  create: async (data) => {
    const response = await api.post('/clothing-brands', data)
    return response.data
  },
  update: async (id, data) => {
    const response = await api.put(`/clothing-brands/${id}`, data)
    return response.data
  },
  delete: async (id) => {
    const response = await api.delete(`/clothing-brands/${id}`)
    return response.data
  }
}

export default api
