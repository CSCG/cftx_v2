import axios from 'axios';

    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://qy5i7jhbb8.execute-api.us-east-2.amazonaws.com/prod-cached';

    export const api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: false,
    });

    api.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        return Promise.reject(error);
      }
    );
