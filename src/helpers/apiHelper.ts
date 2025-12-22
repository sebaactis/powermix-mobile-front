import { getAccessToken, getRefreshToken, setTokens, clearAuthRuntime } from "@/src/helpers/authRuntime";

type ApiError = {
  message: string;
  fields?: Record<string, string> | null;
} | null;

export type ApiResponse<T = unknown> = {
  success: boolean;
  data: T | null;
  error: ApiError;
};

type AuthOptions = {
  onAuthFailed?: () => Promise<void>;
};

let refreshInFlight: Promise<{ accessToken: string; refreshToken: string }> | null = null;

async function tryRefresh(auth: AuthOptions) {
  const rt = getRefreshToken();
  if (!rt) throw new Error("no_refresh_token");

  const refreshUrl = `${process.env.EXPO_PUBLIC_POWERMIX_API_URL}/api/v1/refreshToken`;

  const res = await fetch(refreshUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${rt}`,
    },
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = json?.error?.message ?? json?.message ?? `HTTP ${res.status}`;
    throw new Error(msg);
  }

  const data = (json?.data ?? json) as any;

  const next = {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  };

  if (!next.accessToken || !next.refreshToken) {
    throw new Error("refresh_response_invalid");
  }

  await setTokens(next);
  return next;
}

export async function ApiHelper<T = unknown>(
  url: string,
  method: string = "GET",
  body?: object,
  extraHeaders?: Record<string, string>,
  auth?: AuthOptions
): Promise<ApiResponse<T>> {
  const doFetch = async () => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(extraHeaders || {}),
    };

    if (auth) {
      const at = getAccessToken();
      if (at) headers["Authorization"] = `Bearer ${at}`;
    }

    const fetchData = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const json = (await fetchData.json().catch(() => null)) as Partial<ApiResponse<T>> | null;

    return { fetchData, json };
  };

  try {
    let { fetchData, json } = await doFetch();

    if (fetchData.status === 401 && auth) {
      try {
        if (!refreshInFlight) {
          refreshInFlight = tryRefresh(auth).finally(() => {
            refreshInFlight = null;
          });
        }
        await refreshInFlight;
      } catch {

        await clearAuthRuntime();
        if (auth.onAuthFailed) await auth.onAuthFailed();

        return {
          success: false,
          data: null,
          error: { message: "Sesión expirada o comprometida. Inicia sesión nuevamente.", fields: null },
        };
      }

      ({ fetchData, json } = await doFetch());
    }

    if (json && typeof json.success === "boolean") {
      return {
        success: json.success,
        data: (json.data as T) ?? null,
        error: (json.error as ApiError) ?? null,
      };
    }

    return {
      success: fetchData.ok,
      data: (json as unknown as T) ?? null,
      error: !fetchData.ok
        ? { message: `HTTP error ${fetchData.status}`, fields: null }
        : null,
    };
  } catch {
    return {
      success: false,
      data: null,
      error: { message: "Error de red al llamar a la API", fields: null },
    };
  }
}
