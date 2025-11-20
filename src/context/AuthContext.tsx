import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    ReactNode,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import { loadTokens, saveTokens, clearTokens } from '../storage/tokenStorage';

type User = {
    email: string;
    name: string;
}

type AuthContextValue = {
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    user: User;
    setUser: (user: User) => void;
};

type AuthResponse = {
    email: string;
    name: string;
    token: string;
    refreshToken: string;
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

    const [user, setUser] = useState<User>({
        email: '',
        name: '',
    })

    const signOut = async () => {
        setAccessToken(null);
        setRefreshToken(null);
        setUser({
            email: '',
            name: '',
        })

        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
            logoutTimerRef.current = null;
        }

        await clearTokens();
    };

    const scheduleAutoLogout = (token: string | null) => {
        if (!token) return;

        let decoded: any;
        try {
            decoded = jwtDecode(token);
        } catch (e) {
            console.log('No se pudo decodificar el token', e);
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
            console.log('Token vencido, cerrando sesión…');
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
                    // 🔹 acá el fix importante
                    setAccessToken(tokens.accessToken);
                    setRefreshToken(tokens.refreshToken);
                    scheduleAutoLogout(tokens.accessToken);
                }
            } catch (e) {
                console.log('Error cargando tokens desde storage', e);
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

    const signIn = async (email: string, password: string) => {
        const res = await fetch('http://10.0.2.2:8080/api/v1/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const txt = await res.text();
            console.log('Error login:', txt);
            throw new Error('Credenciales inválidas');
        }

        const data: AuthResponse = await res.json();

        const access = data.token;
        const refresh = data.refreshToken;

        setUser({
            email: data.email,
            name: data.name,
        })
        setAccessToken(access);
        setRefreshToken(refresh);
        await saveTokens(access, refresh);
        scheduleAutoLogout(access);
    };

    const value: AuthContextValue = {
        accessToken,
        refreshToken,
        isAuthenticated: !!accessToken,
        loading,
        signIn,
        signOut,
        user,
        setUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return ctx;
}
