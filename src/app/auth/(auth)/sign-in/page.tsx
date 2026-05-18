import * as React from "react";
import { redirect } from "next/navigation";

import { appConfig } from "@/config/app"; 
import { getUser } from "@/lib/authentication/server";
import { logger } from "@/lib/default-logger"; 
import { SplitLayout } from "@/components/auth/split-layout";
import { SignInForm } from "@/components/auth/sign-in-form";
import { paths } from "@/paths";

export const metadata = { title: `Sign in | Auth | ${appConfig.name}` };

export default async function Page() {
    const { data } = await getUser();

    if (data?.user) {
        logger.debug("[Sign in] User is authenticated, redirecting to dashboard");
        redirect(paths.dashboard.overview);
    }

    return (
        <SplitLayout>
            <SignInForm />
        </SplitLayout>
    );
}