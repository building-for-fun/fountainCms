const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

/** Backend origin (no /api suffix) for loading media files */
function getBackendOrigin(): string {
  return API_BASE.replace(/\/api\/?$/, '') || '';
}

/** Turn relative media URL from API into full URL for img/video src */
export function getMediaFullUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const base = getBackendOrigin();
  return base + (url.startsWith('/') ? url : `/${url}`);
}

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export interface UploadResponse {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
}

export async function listMedia(): Promise<MediaItem[]> {
  const res = await fetch(`${API_BASE}/media`, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    let err: unknown;
    try {
      err = await res.json();
    } catch {
      err = { message: res.statusText };
    }
    throw err;
  }
  return res.json();
}

export async function uploadMedia(file: File): Promise<UploadResponse> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE}/media/upload`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  });
  if (!res.ok) {
    let err: unknown;
    try {
      err = await res.json();
    } catch {
      err = { message: res.statusText };
    }
    throw err;
  }
  return res.json();
}

export async function deleteMedia(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/media/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    let err: unknown;
    try {
      err = await res.json();
    } catch {
      err = { message: res.statusText };
    }
    throw err;
  }
}
