import * as React from "react"; 
import { appConfig } from "@/config/app";  
import { SplitLayout } from "@/components/auth/split-layout";  
import { SetPassword } from "@/components/auth/set-password-form";

export const metadata = { title: `Set Password | Auth | ${appConfig.name}` };

export default async function Page({ searchParams }: { searchParams: Promise<{ token: string }> }) {
    const token = (await searchParams).token; 
    

    return (
        <SplitLayout>
            <SetPassword token={token} />
        </SplitLayout>
    );
}