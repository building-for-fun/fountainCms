import axios, { AxiosInstance } from 'axios';

export interface SDKConfig {
  /**
   * API root including the Nest global prefix `/api`
   * (e.g. `http://localhost:4000/api`). Paths below are relative to this.
   */
  baseURL: string;
  /** JWT or opaque API token (`fcm_…`) as `Authorization: Bearer`. */
  token?: string;
  /** Machine auth alternative to Bearer; same tokens as `token`. */
  apiKey?: string;
  /**
   * Send cookies on cross-origin requests (needed for browser login + HttpOnly JWT cookie).
   * @default true
   */
  withCredentials?: boolean;
}

/** Query params for `GET /content/collections/:collection` (filter JSON is URL-encoded by axios). */
export type ContentListParams = {
  status?: string;
  locale?: string;
  limit?: number;
  offset?: number;
  sort?: string;
  fields?: string;
  populate?: string;
  /** Pass a JSON object; it is serialized to a string for the `filter` query param. */
  filter?: string | Record<string, unknown>;
};

function serializeListParams(
  params?: ContentListParams,
): Record<string, string | number | boolean | undefined> | undefined {
  if (!params) return undefined;
  const { filter, ...rest } = params;
  const out: Record<string, string | number | boolean | undefined> = {
    ...rest,
  };
  if (filter !== undefined) {
    out.filter =
      typeof filter === 'string' ? filter : JSON.stringify(filter);
  }
  return out;
}

export class FountainClient {
  private http: AxiosInstance;

  constructor(config: SDKConfig) {
    const {
      baseURL,
      token,
      apiKey,
      withCredentials = true,
    } = config;
    this.http = axios.create({
      baseURL: baseURL.replace(/\/$/, ''),
      withCredentials,
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
    /** GET `/content/collections/:collection` */
    getMany: async (
      collection: string,
      params?: ContentListParams,
    ): Promise<unknown> => {
      const res = await this.http.get(`/content/collections/${collection}`, {
        params: serializeListParams(params),
      });
      return res.data;
    },

    /** GET `/content/collections/:collection/:id` */
    getOne: async (
      collection: string,
      id: string,
      params?: { populate?: string },
    ): Promise<unknown> => {
      const res = await this.http.get(
        `/content/collections/${collection}/${id}`,
        { params },
      );
      return res.data;
    },

    /** POST `/content/collections/:collection` */
    create: async (
      collection: string,
      data: Record<string, unknown>,
    ): Promise<unknown> => {
      const res = await this.http.post(
        `/content/collections/${collection}`,
        data,
      );
      return res.data;
    },

    /** PATCH `/content/collections/:collection/:id` */
    update: async (
      collection: string,
      id: string,
      data: Record<string, unknown>,
    ): Promise<unknown> => {
      const res = await this.http.patch(
        `/content/collections/${collection}/${id}`,
        data,
      );
      return res.data;
    },

    /** DELETE `/content/collections/:collection/:id` */
    remove: async (collection: string, id: string): Promise<unknown> => {
      const res = await this.http.delete(
        `/content/collections/${collection}/${id}`,
      );
      return res.data;
    },

    /** GET `/content/collections/:collection/:id/revisions` */
    listRevisions: async (
      collection: string,
      id: string,
    ): Promise<unknown> => {
      const res = await this.http.get(
        `/content/collections/${collection}/${id}/revisions`,
      );
      return res.data;
    },

    /** PATCH `/content/collections/:collection/:id/revisions/:version/restore` */
    restoreRevision: async (
      collection: string,
      id: string,
      version: number,
    ): Promise<unknown> => {
      const res = await this.http.patch(
        `/content/collections/${collection}/${id}/revisions/${version}/restore`,
      );
      return res.data;
    },
  };

  /**
   * POST `/graphql` — same auth rules as Content REST (Bearer, X-Api-Key, or cookie session).
   */
  graphql = {
    request: async <TData = unknown>(body: {
      query: string;
      variables?: Record<string, unknown>;
    }): Promise<{ data?: TData; errors?: unknown }> => {
      const res = await this.http.post<{ data?: TData; errors?: unknown }>(
        '/graphql',
        body,
      );
      return res.data;
    },
  };
}
