import { AxiosError, AxiosHeaders, type AxiosResponse } from 'axios';

export function createHttpError(status: number, data: unknown): AxiosError {
  const config = { headers: new AxiosHeaders() };
  const response: AxiosResponse = { status, statusText: '', data, headers: {}, config };
  return new AxiosError(
    `Request failed with status code ${status}`,
    AxiosError.ERR_BAD_REQUEST,
    config,
    undefined,
    response,
  );
}

export function createTransportError(code: string): AxiosError {
  return new AxiosError('Transport failure', code, { headers: new AxiosHeaders() });
}
