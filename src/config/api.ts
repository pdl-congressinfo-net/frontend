const rawApiProvider =
  (window as any).__ENV__?.API_DATA_PROVIDER ||
  import.meta.env.VITE_API_DATA_PROVIDER;

export const API_URL = (rawApiProvider || "").replace(/\/+$/, "");
