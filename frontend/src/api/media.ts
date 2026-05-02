const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

/** Backend origin (no /api suffix) for loading media files */
function getBackendOrigin(): string {
  return API_BASE.replace(/\/api\/?$/, '') || '';
}

/**
 * URL for `<img>` / `<video>` src. Prefer same-origin `/api/media/files/…` when the API
 * returned an absolute URL to another host (e.g. localhost:4000) so the Vite proxy and
 * session cookie on the SPA origin still apply.
 */
export function getMediaFullUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const u = new URL(url);
      if (
        u.pathname.includes('/api/media/files/') &&
        typeof window !== 'undefined' &&
        u.hostname === window.location.hostname
      ) {
        return `${u.pathname}${u.search}`;
      }
    } catch {
      /* ignore */
    }
    return url;
  }
  const base = getBackendOrigin();
  return base + (url.startsWith('/') ? url : `/${url}`);
}

/** Small cached thumbnail for image URLs (transform params). */
export function getMediaImageThumbnailUrl(url: string): string {
  const full = getMediaFullUrl(url);
  if (!full.includes('/media/files/')) return full;
  const join = full.includes('?') ? '&' : '?';
  return `${full}${join}w=160&h=160&fit=cover&q=80`;
}

export interface MediaFolder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  folderId: string | null;
  url: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export interface UploadResponse {
  id: string;
  folderId: string | null;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
}

export async function listFolders(): Promise<MediaFolder[]> {
  const res = await fetch(`${API_BASE}/media/folders`, {
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

export async function createFolder(name: string, parentId?: string): Promise<MediaFolder> {
  const res = await fetch(`${API_BASE}/media/folders`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, ...(parentId ? { parentId } : {}) }),
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

export async function deleteFolder(folderId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/media/folders/${folderId}`, {
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

export async function getMedia(id: string): Promise<MediaItem> {
  const res = await fetch(`${API_BASE}/media/${id}`, {
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

export async function listMedia(folderId?: string): Promise<MediaItem[]> {
  const qs = folderId ? `?folderId=${encodeURIComponent(folderId)}` : '';
  const res = await fetch(`${API_BASE}/media${qs}`, {
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

export async function uploadMedia(file: File, folderId?: string): Promise<UploadResponse> {
  const form = new FormData();
  form.append('file', file);
  if (folderId) form.append('folderId', folderId);
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
