// eslint-disable-next-line spaced-comment
/// <reference types="vite/client" />
// eslint-disable-next-line spaced-comment
/// <reference types="vite-plugin-pwa/info" />
// eslint-disable-next-line spaced-comment
/// <reference types="vite-plugin-pwa/vanillajs" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
