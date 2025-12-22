import { loadTokens, saveTokens, clearTokens } from "@/src/storage/tokenStorage";

type Tokens = { accessToken: string; refreshToken: string };

let accessToken: string | null = null;
let refreshToken: string | null = null;

export async function initAuthRuntimeFromStorage() {
  const t = (await loadTokens()) as Tokens | null;
  accessToken = t?.accessToken ?? null;
  refreshToken = t?.refreshToken ?? null;
}

export function getAccessToken() {
  return accessToken;
}

export function getRefreshToken() {
  return refreshToken;
}

export async function setTokens(next: Tokens) {
  accessToken = next.accessToken;
  refreshToken = next.refreshToken;
  await saveTokens(next.accessToken, next.refreshToken);
}

export async function clearAuthRuntime() {
  accessToken = null;
  refreshToken = null;
  await clearTokens();
}
