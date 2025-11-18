import * as SecureStore from 'expo-secure-store';

const AUTH_KEY = 'auth_tokens'

export async function saveTokens(accessToken: string, refreshToken: string) {
    const payload = {
        accessToken,
        refreshToken
    };

    await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(payload));
}

export async function loadTokens() {
    const json = await SecureStore.getItemAsync(AUTH_KEY);

    if (!json) return null;

    try {
        return JSON.parse(json)
    } catch {
        return null;
    }

}

export async function clearTokens() {
    await SecureStore.deleteItemAsync(AUTH_KEY);
}