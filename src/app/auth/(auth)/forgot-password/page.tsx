import * as React from "react"; 
import { appConfig } from "@/config/app";  
import { SplitLayout } from "@/components/auth/split-layout";  
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata = { title: `Forgot Password | Auth | ${appConfig.name}` };

export default async function Page() {
    return (
        <SplitLayout>
            <ForgotPasswordForm />
        </SplitLayout>
    );
}