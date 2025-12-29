import axios, { AxiosInstance } from "axios";
import { API_URL } from "../config/api";

export const httpClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
});
