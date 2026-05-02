import axios, { AxiosInstance } from 'axios';

export interface SDKConfig {
  /** Include `/api` (e.g. `http://localhost:4000/api`). */
  baseURL: string;
  /** JWT or opaque API token (`fcm_…`) as `Authorization: Bearer`. */
  token?: string;
  /** Machine auth alternative to Bearer; same tokens as `token`. */
  apiKey?: string;
}

export class FountainClient {
  private http: AxiosInstance;

  constructor({ baseURL, token, apiKey }: SDKConfig) {
    this.http = axios.create({
      baseURL: baseURL.replace(/\/$/, ''),
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(apiKey ? { 'X-Api-Key': apiKey } : {}),
      },
    });
  }

  auth = {
    login: async (email: string, password: string) => {
      const res = await this.http.post('/auth/login', { email, password });
      return res.data;
    },
    logout: async () => {
      await this.http.post('/auth/logout');
    },
  };

  content = {
    getMany: async (collection: string, params?: Record<string, unknown>) => {
      const res = await this.http.get(`/content/collections/${collection}`, {
        params,
      });
      return res.data;
    },
    getOne: async (collection: string, id: string) => {
      const res = await this.http.get(
        `/content/collections/${collection}/${id}`,
      );
      return res.data;
    },
  };

  // Add more as needed…
}
