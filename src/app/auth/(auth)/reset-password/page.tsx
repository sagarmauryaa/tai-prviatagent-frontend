import * as React from "react";
import { redirect } from "next/navigation";

import { appConfig } from "@/config/app"; 
import { getUser } from "@/lib/authentication/server";
import { logger } from "@/lib/default-logger"; 
import { SplitLayout } from "@/components/auth/split-layout";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { paths } from "@/paths";

export const metadata = { title: `Reset Password | Auth | ${appConfig.name}` };

export default async function Page({ searchParams }: { searchParams: Promise<{ token: string }> }) {
    const token = (await searchParams).token;

    return (
        <SplitLayout>
            <ResetPasswordForm token={token} />
        </SplitLayout>
    );
}