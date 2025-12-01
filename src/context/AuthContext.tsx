import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import { loadTokens, saveTokens, clearTokens } from "../storage/tokenStorage";
import { loadUser, saveUser, clearUser } from "../storage/userStorage";
import { ApiHelper } from "../helpers/apiHelper";
import Toast from "react-native-toast-message";

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
    const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        setUserState({
            email: "",
            name: "",
        });

        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
            logoutTimerRef.current = null;
        }

        await clearTokens();
        await clearUser();
    };

    const scheduleAutoLogout = (token: string | null) => {
        if (!token) return;

        let decoded: any;
        try {
            decoded = jwtDecode(token);
        } catch (e) {
            console.log("No se pudo decodificar el token", e);
            return;
        }

        if (!decoded.exp) return;

        const msUntilExpiration = decoded.exp * 1000 - Date.now();

        if (msUntilExpiration <= 0) {
            void signOut();
            return;
        }

        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
        }

        logoutTimerRef.current = setTimeout(() => {
            console.log("Token vencido, cerrando sesión…");
            void signOut();
        }, msUntilExpiration);
    };

    useEffect(() => {
        const init = async () => {
            try {
                const tokens = (await loadTokens()) as
                    | { accessToken: string; refreshToken: string | null }
                    | null;

                if (tokens?.accessToken) {
                    setAccessToken(tokens.accessToken);
                    setRefreshToken(tokens.refreshToken);
                    scheduleAutoLogout(tokens.accessToken);
                }

                const storedUser = await loadUser();
                if (storedUser) {
                    setUserState(storedUser);
                }
            } catch (e) {
                console.log("Error cargando tokens/usuario desde storage", e);
            } finally {
                setLoading(false);
            }
        };

        void init();

        return () => {
            if (logoutTimerRef.current) {
                clearTimeout(logoutTimerRef.current);
            }
        };
    }, []);

    const signInWithTokens = async (access: string, refresh: string, loggedUser: User) => {
        setUser(loggedUser);
        setAccessToken(access);
        setRefreshToken(refresh);
        await saveTokens(access, refresh);
        scheduleAutoLogout(access);
    };

    const signIn = async (email: string, password: string) => {
        const url = `${process.env.EXPO_PUBLIC_POWERMIX_API_URL}/api/v1/login`;

        const res = await ApiHelper<AuthResponse>(url, "POST", {
            email,
            password
        })

        if (!res.success || !res.data) {
            Toast.show({
                type: "appError",
                text1: "Error al iniciar sesión",
                text2: res.error?.message
            })
        }

        const { token, refreshToken, email: emailResponse, name } = res.data;


        const loggedUser: User = {
            email: emailResponse,
            name: name,
        };

        await signInWithTokens(token, refreshToken, loggedUser);
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
    if (!ctx) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return ctx;
}
