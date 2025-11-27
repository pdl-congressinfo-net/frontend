import axios, { AxiosInstance } from "axios";

const API_URL = "https://api.dpfurner.xyz/api/v1";

export const httpClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
});
