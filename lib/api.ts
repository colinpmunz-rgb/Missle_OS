const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export async function apiRequest<T = any>(
  path: string,
  options: RequestInit & { token: string }
): Promise<T> {
  const { token, ...rest } = options;
  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(rest.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export function api(token: string) {
  return {
    get: <T = any>(path: string) => apiRequest<T>(path, { method: 'GET', token }),
    post: <T = any>(path: string, body: unknown) =>
      apiRequest<T>(path, { method: 'POST', token, body: JSON.stringify(body) }),
    put: <T = any>(path: string, body: unknown) =>
      apiRequest<T>(path, { method: 'PUT', token, body: JSON.stringify(body) }),
    delete: <T = any>(path: string) => apiRequest<T>(path, { method: 'DELETE', token }),
  };
}
