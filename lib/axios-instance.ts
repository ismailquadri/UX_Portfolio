import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("anonymous_session_token")

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }

  return config;
})