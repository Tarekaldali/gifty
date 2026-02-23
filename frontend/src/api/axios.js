/*
 * Axios Instance
 * --------------
 * Creates a reusable axios client with baseURL pointing to our Express API.
 * Automatically attaches the JWT token to every request if available.
 */

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api", // our Express server (matches PORT in .env)
});

// Before every request, attach the JWT token from localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
