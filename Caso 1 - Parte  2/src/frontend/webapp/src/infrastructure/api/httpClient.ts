const base = "";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export async function httpJson<T>(
  path: string,
  init: RequestInit & { method?: HttpMethod } = {},
): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}
