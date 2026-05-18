import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography"; 
import { appConfig } from "@/config/app"; 
import { WelcomeMessage } from "@/components/dashboard/settings/welcome-message"; 
import {CardHeader,Card,CardContent} from "@mui/material"; 
import PromptForm from "@/components/dashboard/priv-agent-form";
import { ThemeSwitch } from "@/components/dashboard/settings/theme-switch";

export const metadata = { title: `Chatbot Settings | Dashboard | ${appConfig.name}` };

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
				<Typography variant="h4">Chatbot Settings</Typography>
				<Stack spacing={4}>
					<Stack direction={{ md: "row", sm: "column" }} sx={{width:"100%"}} spacing={4}>
						<WelcomeMessage />
						<ThemeSwitch />
					</Stack>
						<Card>
						 <CardHeader
                    title="Prompts"
                />
							<CardContent>
							<Stack direction={'column'} spacing={1} sx={{ alignItems: "flex-start" }}> 
								<Typography variant="body1">Upto 5 prompts can be selected</Typography>
								<Typography variant="body1">Please review and change the default prompts on the chat. Please test and make sure they have responses available.</Typography>
								<PromptForm/>
							</Stack> 
							</CardContent>
						</Card>
				</Stack>
			</Stack>
		</Box>
	);
}
