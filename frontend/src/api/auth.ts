import { api } from './client';

export interface AuthConfig {
  mode: 'local' | 'oauth2' | 'saml';
  loginUrl?: string;
}

export interface LoginResponse {
  token: string;
  user: { id: string; email: string; role: string | null };
}

export interface MeResponse {
  id: string;
  email: string;
  role: string | null;
}

export function fetchAuthConfig() {
  return api<AuthConfig>('/auth/config');
}

export function login(login: string, password: string) {
  return api<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ login, password }),
    credentials: 'include',
  });
}

export function logout() {
  return api<{ ok: boolean }>('/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
}

export function fetchMe() {
  return api<MeResponse>('/auth/me');
}
