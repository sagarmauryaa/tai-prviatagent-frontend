import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { appConfig } from "@/config/app"; 
import { Plans } from "@/components/dashboard/settings/plan";

export const metadata = { title: `Billing | Settings | Dashboard | ${appConfig.name}` };

export default function Page() {
    return (
        <Stack spacing={4}>
            <div>
                <Typography variant="h4">Billing & plans</Typography>
            </div>
            <Stack spacing={4}>
                <Plans /> 
            </Stack>
        </Stack>
    );
}