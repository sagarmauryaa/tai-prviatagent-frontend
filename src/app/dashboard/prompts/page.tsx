import * as React from "react";
import Box from "@mui/material/Box";  
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography"; 

import { appConfig } from "@/config/app";  
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import PromptForm from "@/components/dashboard/propmt-form";

export const metadata = { title: `Prompts | Dashboard | ${appConfig.name}` };

export default function Page() {
	return (
		<Box
			sx={{
				maxWidth: "var(--Content-maxWidth)",
				m: "var(--Content-margin)",
				p: "var(--Content-padding)",
				width: "var(--Content-width)",
			}}
		>
			<Stack spacing={4}>
				<Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "flex-start" }}>
					<Box sx={{ flex: "1 1 auto" }}>
						<Typography variant="h4">Prompts</Typography>
					</Box> 
				</Stack> 
				<Card>
					<CardContent>
						<Stack direction={'column'} spacing={1} sx={{ alignItems: "flex-start" }}>
			 
						<Typography variant="body1">Upto 5 prompts can be selected</Typography>
						<Typography variant="body1">Please remember to save all the changes by clicking on the SAVE button below</Typography>
						<PromptForm/>
						</Stack> 
					</CardContent>
				</Card>
			</Stack>
		</Box>
	);
}
