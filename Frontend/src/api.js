import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to get cookie
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Add a request interceptor to add the auth token and trigger loader
api.interceptors.request.use(
  (config) => {
    window.dispatchEvent(new Event('loading-start'));
    
    const csrftoken = getCookie('csrftoken');
    if (csrftoken) {
      config.headers['X-CSRFToken'] = csrftoken;
    }

    return config;
  },
  (error) => {
    window.dispatchEvent(new Event('loading-end'));
    return Promise.reject(error);
  }
);

// Add response interceptor to stop loader
api.interceptors.response.use(
  (response) => {
    window.dispatchEvent(new Event('loading-end'));
    return response;
  },
  (error) => {
    window.dispatchEvent(new Event('loading-end'));
    return Promise.reject(error);
  }
);

// For Session Auth to work with CORS
api.defaults.withCredentials = true;

export default api;
