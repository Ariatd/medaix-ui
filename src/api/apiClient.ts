/**
 * API Client for MedAIx
 * Handles communication with the backend API
 */

// API Base URL - Backend portun olan 3001'e yönlendirildi
const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Generic API client class
 */
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    // Başlıkları (Headers) hazırlıyoruz
    const headers: Record<string, string> = { 
      ...(options.headers as Record<string, string>) 
    };
    
    // KRİTİK DÜZELTME: 
    // Eğer gönderilen veri FormData (resim) DEĞİLSE JSON başlığı ekle.
    // Eğer resim gönderiliyorsa (FormData), tarayıcının kendi 'boundary' ayarını 
    // yapabilmesi için Content-Type başlığını boş bırakıyoruz.
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        const error: any = new Error(errorData.message || `HTTP ${response.status}`);
        error.response = { status: response.status, statusText: response.statusText };
        throw error;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to the server');
      }
      throw error;
    }
  }

  // Temel HTTP metodları
  async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
async patch<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
  
  async delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// API client örneğini dışa aktar
export const apiClient = new ApiClient(API_BASE_URL);