import axios from 'axios';

const API = axios.create({
  baseURL: 'https://link-saver-auto-summary-ncj5.onrender.com/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.token = token;
  console.log("Request Headers:", config.headers); // Log the headers
  return config;
});

export default API;
