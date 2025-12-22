import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { loadTokens } from "../storage/tokenStorage";
import { loadUser, saveUser, clearUser } from "../storage/userStorage";
import { ApiHelper } from "../helpers/apiHelper";
import Toast from "react-native-toast-message";

import {
  initAuthRuntimeFromStorage,
  setTokens as setRuntimeTokens,
  clearAuthRuntime,
} from "../helpers/authRuntime";

type User = {
  email: string;
  name: string;
};

type AuthContextValue = {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithTokens: (accessToken: string, refreshToken: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
  user: User;
  setUser: (user: User) => void;
};

type AuthResponse = {
  email: string;
  name: string;
  token: string;
  refreshToken: string;
  stampsCounter: number;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [user, setUserState] = useState<User>({
    email: "",
    name: "",
  });

  const setUser = (newUser: User) => {
    setUserState(newUser);
    void saveUser(newUser);
  };

  const signOut = async () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUserState({ email: "", name: "" });

    await clearAuthRuntime();
    await clearUser();
  };

  useEffect(() => {
    const init = async () => {
      try {

        await initAuthRuntimeFromStorage();

        const tokens = (await loadTokens()) as
          | { accessToken: string; refreshToken: string | null }
          | null;

        if (tokens?.accessToken) {
          setAccessToken(tokens.accessToken);
          setRefreshToken(tokens.refreshToken ?? null);
        }

        const storedUser = await loadUser();
        if (storedUser) setUserState(storedUser);
      } catch (e) {
        console.log("Error cargando tokens/usuario desde storage", e);
      } finally {
        setLoading(false);
      }
    };

    void init();
  }, []);

  const signInWithTokens = async (access: string, refresh: string, loggedUser: User) => {
    setUser(loggedUser);
    setAccessToken(access);
    setRefreshToken(refresh);

    await setRuntimeTokens({ accessToken: access, refreshToken: refresh });
  };

  const signIn = async (email: string, password: string) => {
    const baseUrl = process.env.EXPO_PUBLIC_POWERMIX_API_URL!;
    const url = `${baseUrl}/api/v1/login`;

    const res = await ApiHelper<AuthResponse>(url, "POST", { email, password });

    if (!res.success || !res.data) {
      Toast.show({
        type: "appError",
        text1: "Error al iniciar sesión",
        text2: res.error?.message,
      });
      return;
    }

    const { token, refreshToken: rt, email: emailResponse, name } = res.data;

    const loggedUser: User = { email: emailResponse, name };

    await signInWithTokens(token, rt, loggedUser);
  };

  const value: AuthContextValue = {
    accessToken,
    refreshToken,
    isAuthenticated: !!accessToken,
    loading,
    signIn,
    signInWithTokens,
    signOut,
    user,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return ctx;
}
