import { isAxiosError } from 'axios';

export const API_ERROR_CODE = {
  NETWORK: 'network_error',
  TIMEOUT: 'timeout',
  UNKNOWN: 'unknown',
} as const;
export type API_ERROR_CODE = (typeof API_ERROR_CODE)[keyof typeof API_ERROR_CODE];

const TIMEOUT_ERROR_CODES = new Set(['ECONNABORTED', 'ETIMEDOUT']);

type ApiErrorDetails = { status: number | undefined; code: string; endpoint: string; cause?: unknown };

export class ApiError extends Error {
  readonly status: number | undefined;
  readonly code: string;
  readonly endpoint: string;

  constructor({ status, code, endpoint, cause }: ApiErrorDetails) {
    super(`SmartNews request to ${endpoint} failed (status ${status ?? 'none'}, code ${code})`, { cause });
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.endpoint = endpoint;
  }
}

export function toApiError(error: unknown, endpoint: string): ApiError {
  if (error instanceof ApiError) return error;
  if (!isAxiosError(error)) {
    return new ApiError({ status: undefined, code: API_ERROR_CODE.UNKNOWN, endpoint, cause: error });
  }
  if (error.response) {
    return new ApiError({
      status: error.response.status,
      code: readErrorCode(error.response.data),
      endpoint,
      cause: error,
    });
  }
  const code = TIMEOUT_ERROR_CODES.has(error.code ?? '') ? API_ERROR_CODE.TIMEOUT : API_ERROR_CODE.NETWORK;
  return new ApiError({ status: undefined, code, endpoint, cause: error });
}

function readErrorCode(body: unknown): string {
  if (typeof body !== 'object' || body === null || !('error' in body)) return API_ERROR_CODE.UNKNOWN;
  const { error } = body;
  if (typeof error !== 'object' || error === null || !('code' in error)) return API_ERROR_CODE.UNKNOWN;
  return typeof error.code === 'string' ? error.code : API_ERROR_CODE.UNKNOWN;
}
