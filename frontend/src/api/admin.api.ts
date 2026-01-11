import { api } from './client';
import { UserResponse } from '../types/admin';

export async function fetchUsersCount(): Promise<number> {
  const res = await api<UserResponse>('/user');

  if (!res) return 0;

  if (Array.isArray(res)) return res.length;
  if ('data' in res) {
    if (res.data == null) return 0;
    if (Array.isArray(res.data)) return res.data.length;
    return 1;
  }

  return 0;
}
