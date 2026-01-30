const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

function normalizePath(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return p.startsWith('/api/') ? p : `/api${p}`;
}

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${normalizePath(path)}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!res.ok) {
    let error;
    try {
      error = await res.json();
    } catch {
      error = { message: res.statusText };
    }
    throw error;
  }

  return res.json();
}
