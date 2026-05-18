import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { appConfig } from "@/config/app";  
import { PasswordForm } from "@/components/dashboard/accounts/password-form";

export const metadata = { title: `Security | Settings | Dashboard | ${appConfig.name}` };

export default function Page() {
    return (
        <Stack spacing={4}>
            <div>
                <Typography variant="h4">Security</Typography>
            </div>
            <Stack spacing={4}>
                <PasswordForm /> 
            </Stack>
        </Stack>
    );
}