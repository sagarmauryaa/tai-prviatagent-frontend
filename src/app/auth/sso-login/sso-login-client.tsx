"use client";

import { useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import PageLoader from "@/components/dashboard/layout/loader";
import { paths } from "@/paths";
import { toast } from "@/components/core/toaster";
import { useAuth } from "@/components/auth/auth-context";


export function SSOLoginClient() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const auth = useAuth();
    const verifySSO = useCallback(async () => {
        if (!token) {
            window.location.href = paths.auth.signIn;
            return;
        }

        try {
            const res = await fetch(
                `${process.env.BACKEND_ENDPOINT}/dashboard/verify-sso`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                }
            );

            if (!res.ok) {
                throw new Error("SSO verification failed");
            }

            const { status, data } = await res.json();
            const { token: sessionToken, subscription } = data || {};
            if (status === 200 && sessionToken) {
                if (subscription) {
                    if (typeof subscription === 'string' && subscription === "Activeted free plan") {
                        window.location.reload();
                    } else {
                        auth.setCurrentSubscription(subscription)
                    }
                }
                // Set the access token cookie
                Cookies.set("access_token", sessionToken);

                toast.success("SSO Login successful");

                // Redirect to dashboard with a full reload to refresh AuthContext
                window.location.href = paths.dashboard.overview;
            } else {
                throw new Error("SSO verification failed");
            }
        } catch (error) {
            console.error("SSO Error:", error);
            toast.error("SSO Login failed. Please sign in manually.");
            window.location.href = paths.auth.signIn;
        }
    }, [token]);

    useEffect(() => {
        verifySSO();
    }, [verifySSO]);

    return <PageLoader />;
}

export default function SSOLoginWrapper() {
    return (
        <Suspense fallback={<PageLoader />}>
            <SSOLoginClient />
        </Suspense>
    );
}
