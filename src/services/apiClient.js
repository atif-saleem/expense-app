export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = `api/${status}`;
  }
}

const API_BASE_URL = 'https://adilsaleemgs.free.nf/api';

export const apiFetch = async (path, options = {}) => {
  const headers = {
    ...(options.headers ?? {})
  };

  if (options.body) {
    headers['Content-Type'] = 'text/plain';
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(payload?.error ?? 'Request failed. Please try again.', response.status);
  }

  return payload;
};
