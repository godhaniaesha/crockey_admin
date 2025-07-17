// src/utils/axiosInstance.js

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true, // Important for cookies
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Function to refresh the access token
const refreshAccessToken = async () => {
  try {
    // Only need to send cookies, not refreshToken in body
    const response = await axios.post(
      'http://localhost:5000/api/auth/refresh-token',
      {},
      { withCredentials: true }
    );
    const { accessToken } = response.data;
    if (accessToken) {
      localStorage.setItem('token', accessToken);
      return accessToken;
    }
    // If no accessToken, treat as failure
    throw new Error('No access token in response');
  } catch (error) {
    // Logout on failure
    localStorage.removeItem('token');
    window.location.href = '/login';
    return null;
  }
};

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
