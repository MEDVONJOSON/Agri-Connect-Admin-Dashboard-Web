import axios, { AxiosInstance, AxiosError } from 'axios';
import { auth } from './auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://agriconnect-api.onrender.com', // Placeholder for now
      timeout: 10000,
    });

    // Request interceptor
    this.client.interceptors.request.use(
      async (config) => {
        const tokens = await auth.getTokens();
        if (tokens && tokens.accessToken) {
          config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await auth.refreshToken();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, user should likely be logged out
            await auth.logout();
            return Promise.reject(refreshError);
          }
        }

        if (error.response) {
          console.error('API Error:', error.response.status, error.response.data);
        } else if (error.request) {
          console.error('Network Error:', error.message);
        } else {
          console.error('Error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  // Chat API
  async chat(message: string, imageData?: string) {
    const response = await this.client.post('/api/chat', {
      message,
      imageData,
    });
    return response.data;
  }

  // Marketplace API
  async getProducts(params?: { category?: string; seller_id?: string }) {
    const response = await this.client.get('/api/marketplace/products', { params });
    return response.data;
  }

  async getProduct(id: number) {
    const response = await this.client.get(`/api/marketplace/products/${id}`);
    return response.data;
  }

  async createProduct(productData: any) {
    const response = await this.client.post('/api/marketplace/products', productData);
    return response.data;
  }

  async submitInquiry(inquiryData: any) {
    const response = await this.client.post('/api/marketplace/inquiries', inquiryData);
    return response.data;
  }

  async createOrder(orderData: any) {
    const response = await this.client.post('/api/marketplace/orders', orderData);
    return response.data;
  }

  // AI APIs
  async detectDisease(imageData: string, cropType: string) {
    const response = await this.client.post('/api/ai/disease-detection', {
      imageData,
      cropType,
    });
    return response.data;
  }

  async getCropRecommendation(data: {
    soilType: string;
    rainfall: number;
    climate: string;
    location?: string;
  }) {
    const response = await this.client.post('/api/ai/crop-recommendation', data);
    return response.data;
  }

  async getFertilizerGuide(data: {
    cropType: string;
    soilType: string;
    growthStage: string;
  }) {
    const response = await this.client.post('/api/ai/fertilizer-guide', data);
    return response.data;
  }

  async predictYield(data: {
    cropType: string;
    area: number;
    soilQuality: string;
    weatherConditions: string;
  }) {
    const response = await this.client.post('/api/ai/yield-prediction', data);
    return response.data;
  }

  // Health check
  async healthCheck() {
    const response = await this.client.get('/api/health');
    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
