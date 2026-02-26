import { api } from './client';
import { hashPasswordForTransport } from '../lib/passwordHash';

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

/** Login with email/username and plain password. Password is hashed client-side before send. */
export async function login(login: string, plainPassword: string) {
  const password = await hashPasswordForTransport(plainPassword);
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

/** Change password. Both values are hashed client-side before send. */
export async function changePassword(currentPlainPassword: string, newPlainPassword: string) {
  const [currentPassword, newPassword] = await Promise.all([
    currentPlainPassword
      ? hashPasswordForTransport(currentPlainPassword)
      : Promise.resolve(undefined),
    hashPasswordForTransport(newPlainPassword),
  ]);
  return api<{ ok: boolean }>('/auth/me/password', {
    method: 'POST',
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
    credentials: 'include',
  });
}
