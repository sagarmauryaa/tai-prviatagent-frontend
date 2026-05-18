"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import { authenticateToken, getBrandsInstance, verifySubscription } from "@/utils/backend-endpoints";

interface User {
    userId: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
}

interface Brands {
    _id: string;
    tellofyBrandUrl: string;
    name: string;
    welcomeMessage: string;
    chatbotTheme: "light" | "dark" | "system";
    apiKey: string;
    businessCategory: { name: string; id: string };
}
interface Subscription {
    _id: string;
    subsId: string;
    isActive: boolean,
    endDate: number,
    activeDate: number,
    totalDatasize: number,
    totalToken: number,
    name: string, price: number, token: number, dataSize: number, allowCsv: boolean, allowChatTheme: boolean, allowAvatar: boolean, isCopyrighted: boolean, instance: number, unanswered: boolean, subscriptionType: string, validDays?: number,
}

interface AuthContextValue {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    selectedBrand?: Brands | null;
    currentSubscription?: Subscription | null;
    brands: Brands[] | null;
    setLoading: (status: boolean) => void;
    setUser: (user: User | null) => void;
    setBrands: (brand: Brands[] | null) => void;
    setSelectedBrand: (brand: Brands | null) => void;
    setCurrentSubscription: (brand: Subscription | null) => void;
    getBrands: () => Promise<Brands[] | null>;
    updateDataSize: (size: number, isPlus?:boolean) => void;
}

export const AuthContext = React.createContext<AuthContextValue>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    currentSubscription: null,
    brands: [],
    setUser: () => { },
    selectedBrand: null,
    setLoading: () => { },
    setBrands: () => { },
    setSelectedBrand: () => { },
    setCurrentSubscription: () => { },
    getBrands: () => Promise.resolve(null),
    updateDataSize: () => { }
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, setState] = React.useState<Omit<AuthContextValue, 'setUser' | 'setSelectedBrand' | 'setLoading' | 'setCurrentSubscription' | 'getBrands' | 'updateDataSize' | 'setBrands'>>({
        isAuthenticated: false,
        isLoading: true,
        user: null,
        brands: [],
        selectedBrand: null,
        currentSubscription: null
    });
    const router = useRouter();
    const token = Cookies.get("access_token");

    const setLoading = (loading: boolean) => {
        setState((prevState) => ({ ...prevState, isLoading: loading }));
    };
    const setUser = (user: User | null) => {
        setState((prevState) => ({ ...prevState, isAuthenticated: Boolean(user), user }));
    };
    const setBrands = (brands: Brands[] | null) => {
        setState((prevState) => ({ ...prevState, brands }));
    };
    const setSelectedBrand = (brand: Brands | null) => {
        Cookies.set('brandInstance', JSON.stringify(brand))
        setState((prevState) => ({ ...prevState, selectedBrand: brand }));
    };


    const setCurrentSubscription = (subscription: Subscription | null) => {
        setState((prevState) => ({ ...prevState, currentSubscription: subscription }));
        if (subscription && subscription?.isActive) {
            Cookies.set('is_subscription_active', 'true');
        } else {
            Cookies.remove('is_subscription_active');
        }
    };
    const updateDataSize = (size: number, isPlus = true) => {
        setState((prevState) => {
            if (!prevState.currentSubscription) return prevState;
            const dataSize = isPlus 
                ? prevState.currentSubscription.dataSize + size 
                : Math.max(0, prevState.currentSubscription.dataSize - size)
            return {
                ...prevState,
                currentSubscription: {
                    ...prevState.currentSubscription,
                    dataSize,
                }
            };
        });
    };
    const getUser = async () => {
        if (token && token != 'undefined') {
            setLoading(true);
            try {
                const { data, status } = await authenticateToken(token);

                if (status === 200) {
                    const { token,...userData } = data?.data
                    Cookies.set('access_token', token)
                    return userData
                } else {
                    Cookies.remove('access_token')
                    router.refresh();
                    return null;
                }
            } catch (error: any) {
                Cookies.remove('access_token')
                router.refresh();
                return null;
            }
        }
    }
    const identifySubscription = async () => {
        if (token && token != 'undefined') {
            setLoading(true);
            try {
                const { data, status } = await verifySubscription();

                if (status === 200) {
                    setCurrentSubscription(data?.data ?? null);
                    if (data?.data && !data?.data.isActive) {
                        router.push('/dashboard/subscription-plans')
                    }
                } else {
                    return null;
                }
            } catch (error: any) {
                return null;
            }
        }
    }

    const getBrands = async () => {
        if (token && token != 'undefined') {
            try {
                setLoading(true);
                const { data, status } = await getBrandsInstance(token);
                if (status === 200) {
                    const brandList = data?.data;
                    setBrands(brandList);
                    const hasBrand = Cookies.get('brandInstance') !== 'undefined' ? JSON.parse(Cookies.get('brandInstance') ?? 'null') : null;

                    if (hasBrand && hasBrand._id) {
                        const checkHasSelectedBrand = brandList.filter((brand: Brands) => brand._id === hasBrand._id);
                        if (checkHasSelectedBrand.length > 0) {
                            setSelectedBrand(checkHasSelectedBrand[0]);
                        } else {
                            setSelectedBrand(brandList[0]);
                        }
                    } else {
                        setSelectedBrand(brandList[0]);
                    }
                    return data?.data
                }
                return null;
            } catch (error: any) {
                console.error('Error fetching brands:', error);
                return null;
            }
        }
        return null;
    }



    React.useEffect(() => {
        const initialize = async () => {
            const userData = await getUser();
            const isAuthenticated = Boolean(userData);
            await getBrands() ?? '';
            await identifySubscription();

            setState((prevState) => ({
                ...prevState,
                isAuthenticated,
                isLoading: false,
                user: userData || null,
            }));
        };

        initialize();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                ...state,
                setUser,
                setCurrentSubscription,
                setBrands,
                setSelectedBrand,
                updateDataSize,
                setLoading,
                getBrands
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