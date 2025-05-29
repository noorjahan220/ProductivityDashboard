import axios from "axios";

const axiosPublic = axios.create({
  baseURL: 'http://localhost:5000', // Changed from 3000 to 5000
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Request interceptor
axiosPublic.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with improved error handling
axiosPublic.interceptors.response.use(
  (response) => {
    console.log('Response received from:', response.config.url);
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with an error status
      console.error('Server Error:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', {
        url: error.config?.url,
        message: 'No response received from server'
      });
    } else {
      // Something else happened
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosPublic;