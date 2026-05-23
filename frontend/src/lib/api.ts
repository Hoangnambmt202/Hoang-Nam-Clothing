export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include", // gửi cookie refresh token
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.message || errorText);
    } catch (e) {
      if (e instanceof SyntaxError) {
        throw new Error(errorText);
      }
      throw e;
    }
  }

  const json = await res.json();
  if (json && typeof json === "object" && json.success === true && "data" in json) {
    return json.data;
  }
  return json;
}

