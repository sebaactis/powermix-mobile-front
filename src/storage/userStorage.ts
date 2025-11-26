
import * as SecureStore from 'expo-secure-store';

const USER_KEY = 'pm_user';

export type StoredUser = {
    email: string;
    name: string;
};

export async function saveUser(user: StoredUser): Promise<void> {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}

export async function loadUser(): Promise<StoredUser | null> {
    const json = await SecureStore.getItemAsync(USER_KEY);
    if (!json) return null;
    try {
        return JSON.parse(json) as StoredUser;
    } catch {
        return null;
    }
}

export async function clearUser(): Promise<void> {
    await SecureStore.deleteItemAsync(USER_KEY);
}
