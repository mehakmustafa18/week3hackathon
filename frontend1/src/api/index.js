import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

// Attach token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally (token expired)
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ────────────────────────────────────────────────
export const authAPI = {
  signup: (data)  => API.post('/auth/signup', data),
  login:  (data)  => API.post('/auth/login', data),
  getMe:  ()      => API.get('/auth/me')
};

// ─── Products ────────────────────────────────────────────
export const productAPI = {
  getAll:     (params) => API.get('/products', { params }),
  getFeatured: ()      => API.get('/products/featured'),
  getOne:     (id)     => API.get(`/products/${id}`),
  getRelated: (id)     => API.get(`/products/${id}/related`),
  create:     (data)   => API.post('/products', data),
  update:     (id, data) => API.put(`/products/${id}`, data),
  remove:     (id)     => API.delete(`/products/${id}`)
};

// ─── Cart ─────────────────────────────────────────────────
export const cartAPI = {
  get:    ()            => API.get('/cart'),
  add:    (data)        => API.post('/cart/add', data),
  update: (data)        => API.put('/cart/update', data),
  remove: (itemId)      => API.delete(`/cart/remove/${itemId}`),
  clear:  ()            => API.delete('/cart/clear')
};

// ─── Orders ───────────────────────────────────────────────
export const orderAPI = {
  place:      (data)   => API.post('/orders/place', data),
  getMyOrders: ()      => API.get('/orders/my-orders'),
  getOne:     (id)     => API.get(`/orders/${id}`),
  getAll:     (params) => API.get('/orders', { params }),
  updateStatus: (id, status) => API.put(`/orders/${id}/status`, { status })
};

// ─── Admin ────────────────────────────────────────────────
export const adminAPI = {
  getStats:      ()      => API.get('/admin/stats'),
  getUsers:      (params) => API.get('/admin/users', { params }),
  blockUser:     (id)    => API.put(`/admin/users/${id}/block`),
  changeRole:    (id, role) => API.put(`/admin/users/${id}/role`, { role })
};

export default API;
