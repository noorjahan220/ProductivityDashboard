import axios from "axios";
import { useEffect } from "react";

export const axiosSecure = axios.create({
  baseURL: 'https://productivity-dasboard-server.vercel.app',
});

const useAxiosSecure = () => {

  useEffect(() => {
    // Request interceptor to add token header
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access-token');
        if (token) {
          config.headers.authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: just pass errors through
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error)
    );

    // Cleanup interceptors when component unmounts
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return axiosSecure;
};

export default useAxiosSecure;
