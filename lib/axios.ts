import axios from 'axios';

    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://n8n.og1.xyz/webhook';

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
