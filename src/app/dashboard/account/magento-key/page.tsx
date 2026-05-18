import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography"; 
import { appConfig } from "@/config/app";
import { MagentoKey } from "@/components/dashboard/accounts/magento-key";
 ; 

export const metadata = { title: `Magento API Key | Settings | Dashboard | ${appConfig.name}` };

export default function Page() {
    return (
        <Stack spacing={4}>
            <div>
                <Typography variant="h4">Magento API Key</Typography>
            </div>
            <Stack spacing={4}>
                <MagentoKey /> 
            </Stack>
        </Stack>
    );
}