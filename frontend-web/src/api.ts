import axios from "axios";

export const authApi = axios.create({ baseURL: "http://localhost:4001", withCredentials: true });
export const catalogApi = axios.create({ baseURL: "http://localhost:4002", withCredentials: true });
export const orderApi = axios.create({ baseURL: "http://localhost:4003", withCredentials: true });

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
