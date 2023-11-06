import axios from "axios";

let baseURL = "http://localhost:8000";

const instance = axios.create({
  baseURL,
});

instance.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem("profile"))?.data?.token;

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;
