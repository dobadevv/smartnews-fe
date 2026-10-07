import 'server-only';
import axios, { type AxiosInstance } from 'axios';

const REQUEST_TIMEOUT_MS = 10_000;

let apiClient: AxiosInstance | undefined;

export function getApiClient(): AxiosInstance {
  apiClient ??= createApiClient();
  return apiClient;
}

function createApiClient(): AxiosInstance {
  const baseURL = process.env.SMARTNEWS_SERVICE_URL;
  if (!baseURL) {
    throw new Error('SMARTNEWS_SERVICE_URL is not set — copy .env.example to .env.local');
  }
  // The Node http adapter keeps requests off the patched fetch, so Next's Data Cache never applies.
  return axios.create({ baseURL, timeout: REQUEST_TIMEOUT_MS, adapter: 'http' });
}
