const rawApiProvider =
  (typeof __API_DATA_PROVIDER__ !== "undefined" && __API_DATA_PROVIDER__) ||
  import.meta.env.VITE_API_DATA_PROVIDER;

const normalizedApiProvider = (rawApiProvider || "").replace(/\/+$/, "");

if (!normalizedApiProvider) {
  console.warn("API_DATA_PROVIDER is not set. Define it in your environment.");
}

// Normalized API base URL; strips trailing slashes to avoid double-slash joins
export const API_URL = normalizedApiProvider;
