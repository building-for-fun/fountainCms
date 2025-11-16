declare module '@vitejs/plugin-react';

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  // add more VITE_ variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
