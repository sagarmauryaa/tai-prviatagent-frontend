import { SSOLoginClient } from "./sso-login-client";
import { Suspense } from "react";
import PageLoader from "@/components/dashboard/layout/loader";

export const metadata = {
    title: `SSO Login | Auth`,
};

export default function Page() {
    return (
        <Suspense fallback={<PageLoader />}>
            <SSOLoginClient />
        </Suspense>
    );
}