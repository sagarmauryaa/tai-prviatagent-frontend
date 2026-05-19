"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

export interface AuthUser {
    _id: string;
    username: string;
    fullName?: string;
    role: string;
    isAdmin: boolean;
    projects: string[];
    canCrudFiles: boolean;
    hasPrivateDocAccess: boolean;
    createdAt: string;
    updatedAt: string;
}

interface AuthContextValue {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: AuthUser | null;
    setLoading: (status: boolean) => void;
    setUser: (user: AuthUser | null) => void;
    updateUser: (updates: Partial<AuthUser>) => void;
    signOut: () => void;
}

export const AuthContext = React.createContext<AuthContextValue>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    setUser: () => { },
    setLoading: () => { },
    updateUser: () => { },
    signOut: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, setState] = React.useState<Omit<AuthContextValue, 'setUser' | 'setLoading' | 'signOut' | 'updateUser'>>({
        isAuthenticated: false,
        isLoading: true,
        user: null,
    });
    const router = useRouter();

    const setLoading = (loading: boolean) => {
        setState((prevState) => ({ ...prevState, isLoading: loading }));
    };

    const setUser = (user: AuthUser | null) => {
        setState((prevState) => ({ ...prevState, isAuthenticated: Boolean(user), user }));
    };

    const signOut = () => {
        Cookies.remove('access_token');
        Cookies.remove('user_info');
        setState({ isAuthenticated: false, isLoading: false, user: null });
        router.push('/auth/sign-in');
    };

    const updateUser = (updates: Partial<AuthUser>) => {
        setState((prev) => {
            if (!prev.user) return prev;
            const updated = { ...prev.user, ...updates };
            Cookies.set('user_info', JSON.stringify(updated), { expires: 1 });
            return { ...prev, user: updated };
        });
    };

    React.useEffect(() => {
        const initialize = () => {
            const token = Cookies.get('access_token');
            const userInfoRaw = Cookies.get('user_info');

            if (token && userInfoRaw) {
                try {
                    const user: AuthUser = JSON.parse(userInfoRaw);
                    setState({ isAuthenticated: true, isLoading: false, user });
                } catch {
                    Cookies.remove('access_token');
                    Cookies.remove('user_info');
                    setState({ isAuthenticated: false, isLoading: false, user: null });
                }
            } else {
                setState({ isAuthenticated: false, isLoading: false, user: null });
            }
        };

        initialize();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                ...state,
                setUser,
                setLoading,
                updateUser,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = React.useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}