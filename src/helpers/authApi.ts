import { ApiHelper, ApiResponse } from "./apiHelper";

export function AuthApi<T>(
  url: string,
  method: string,
  signOut: () => Promise<void>,
  body?: object,
  extraHeaders?: Record<string, string>,
): Promise<ApiResponse<T>> {

  return ApiHelper<T>(
    url,
    method,
    body,
    extraHeaders,
    { onAuthFailed: signOut }
  );
}