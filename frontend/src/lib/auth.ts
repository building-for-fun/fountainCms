export interface User {
  id?: string;
  email: string;
  role: string;
  token?: string;
}

const STORAGE_KEY = 'hc_user';

export function login(user: User) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    // ignore storage failures
    // eslint-disable-next-line no-console
    console.warn('Failed to persist user to localStorage', (e as Error).message);
  }
}

export function logout() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Failed to remove user from localStorage', (e as Error).message);
  }
}

export function getUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch (e) {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getUser();
}

export function hasRole(role: string): boolean {
  const u = getUser();
  return !!u && u.role === role;
}
