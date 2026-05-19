"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import { validateSessionToken } from "@/lib/authentication/validate-session";

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
    isValidatingSession: boolean;
    user: AuthUser | null;
    setLoading: (status: boolean) => void;
    setUser: (user: AuthUser | null) => void;
    updateUser: (updates: Partial<AuthUser>) => void;
    signOut: () => void;
}

export const AuthContext = React.createContext<AuthContextValue>({
    isAuthenticated: false,
    isLoading: true,
    isValidatingSession: true,
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
        isValidatingSession: true,
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
        // Clear token cookie (user data is only in React state, no cleanup needed)
        Cookies.remove('access_token'); 
        setState({ isAuthenticated: false, isLoading: false, isValidatingSession: false, user: null });
        router.push('/auth/sign-in');
    };

    const updateUser = (updates: Partial<AuthUser>) => {
        setState((prev) => {
            if (!prev.user) return prev;
            const updated = { ...prev.user, ...updates };
            return { ...prev, user: updated };
        });
    };

    React.useEffect(() => {
        const initialize = async () => {
            try {
                // Check for token in cookies
                const token = Cookies.get('access_token');

                // If no token, skip validation
                if (!token) {
                    setState({ isAuthenticated: false, isLoading: false, isValidatingSession: false, user: null });
                    return;
                }

                // Set validating state while checking session
                setState((prev) => ({ ...prev, isValidatingSession: true }));

                // Validate the session token with backend
                let validatedUser: AuthUser | null = null;
                try {
                    validatedUser = await validateSessionToken();
                    console.log('validatedUser:',validatedUser);
                    
                } catch (validationError) {
                    // Network errors or other issues - clear token and logout
                    console.error('[AuthProvider] Session validation error:', validationError);
                    Cookies.remove('access_token');
                    setState({ isAuthenticated: false, isLoading: false, isValidatingSession: false, user: null });
                    return;
                }

                // If validation succeeded and we have user data
                if (validatedUser) {
                    setState({ isAuthenticated: true, isLoading: false, isValidatingSession: false, user: validatedUser });
                } else {
                    // Validation returned no user data, clear token and logout
                    Cookies.remove('access_token');
                    setState({ isAuthenticated: false, isLoading: false, isValidatingSession: false, user: null });
                }
            } catch (error) {
                // Unexpected error during initialization
                console.error('[AuthProvider] Initialization error:', error);
                Cookies.remove('access_token');
                setState({ isAuthenticated: false, isLoading: false, isValidatingSession: false, user: null });
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