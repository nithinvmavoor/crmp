import axios from "axios";

const AUTH_URL = import.meta.env.VITE_AUTH_API_URL;
const CATALOG_URL = import.meta.env.VITE_CATALOG_API_URL;
const ORDER_URL = import.meta.env.VITE_ORDER_API_URL;

export const authApi = axios.create({
  baseURL: AUTH_URL,
  withCredentials: true,
});

export const catalogApi = axios.create({
  baseURL: CATALOG_URL,
  withCredentials: true,
});

export const orderApi = axios.create({
  baseURL: ORDER_URL,
  withCredentials: true,
});

const attachToken = (config: any) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

catalogApi.interceptors.request.use(attachToken);
orderApi.interceptors.request.use(attachToken);
