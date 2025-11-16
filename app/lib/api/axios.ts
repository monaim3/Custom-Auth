
// import axios from 'axios';

// const apiClient = axios.create({
//   baseURL: "https://todo-app.pioneeralpha.com",
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor to add auth token
// apiClient.interceptors.request.use(
//   (config) => {
//     if (typeof window !== 'undefined') {
//       const token = localStorage.getItem('token');
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       if (typeof window !== 'undefined') {
//         localStorage.removeItem('token');
//         window.location.href = '/auth/login';
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default apiClient;

import axios from 'axios';

const apiClient = axios.create({
  baseURL: "https://todo-app.pioneeralpha.com",
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;