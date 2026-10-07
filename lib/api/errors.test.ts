import { describe, expect, it } from 'vitest';
import { ApiError, toApiError } from '@/lib/api/errors';
import { createHttpError, createTransportError } from '@/test/fixtures/axios';

describe('toApiError', () => {
  it('reads status and code from an HTTP error body', () => {
    const error = toApiError(
      createHttpError(404, { error: { code: 'article_not_found', message: 'missing' } }),
      '/articles/1',
    );
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 404, code: 'article_not_found', endpoint: '/articles/1' });
    expect(error.message).toContain('/articles/1');
    expect(error.message).toContain('404');
    expect(error.message).toContain('article_not_found');
  });

  it('uses unknown when the HTTP error body has no code', () => {
    expect(toApiError(createHttpError(502, '<html>bad gateway</html>'), '/articles')).toMatchObject({
      status: 502,
      code: 'unknown',
    });
  });

  it.each(['ECONNABORTED', 'ETIMEDOUT'])('maps %s to timeout', (code) => {
    expect(toApiError(createTransportError(code), '/articles')).toMatchObject({
      status: undefined,
      code: 'timeout',
    });
  });

  it('maps other transport failures to network_error', () => {
    expect(toApiError(createTransportError('ERR_NETWORK'), '/articles')).toMatchObject({
      status: undefined,
      code: 'network_error',
    });
  });

  it('wraps a non-axios error as unknown and keeps it as the cause', () => {
    const original = new TypeError('boom');
    const error = toApiError(original, '/sources');
    expect(error).toMatchObject({ status: undefined, code: 'unknown', endpoint: '/sources' });
    expect(error.cause).toBe(original);
  });

  it('returns an existing ApiError unchanged', () => {
    const existing = new ApiError({ status: 500, code: 'internal', endpoint: '/articles' });
    expect(toApiError(existing, '/other')).toBe(existing);
  });
});
