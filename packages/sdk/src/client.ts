import axios, { AxiosInstance } from 'axios';

export interface SDKConfig {
  baseURL: string;
  token?: string;
}

export class FountainClient {
  private http: AxiosInstance;

  constructor({ baseURL, token }: SDKConfig) {
    this.http = axios.create({
      baseURL,
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
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
    getMany: async (collection: string, params?: any) => {
      const res = await this.http.get(`/content/${collection}`, { params });
      return res.data;
    },
    getOne: async (collection: string, id: string) => {
      const res = await this.http.get(`/content/${collection}/${id}`);
      return res.data;
    },
  };

  // Add more as needed…
}
