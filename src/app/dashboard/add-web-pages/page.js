import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { appConfig } from "@/config/app";
import WebPageData from "@/components/dashboard/webpagedata";
import WebPageForm from "@/components/dashboard/webpage-form";

export const metadata = { title: `Add Web Pages | Dashboard | ${appConfig.name}` };

export default function Page() {
	const infoData = [
		{
			id: "1",
			value: "Test"
		},
		{
			id: "2",
			value: "Nobby Test Kharghar"
		}
	]
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
						<Typography variant="h4">Add Web Pages</Typography>
					</Box>
				</Stack>
				<WebPageForm />
				<Grid container spacing={4}>
					<Stack direction={'column'} spacing={3} sx={{ alignItems: "flex-start", width: '100%' }}>
						<Box sx={{ flex: "1 1 auto" }}>
							<Typography variant="h5">Additional Info</Typography>
						</Box>
						{
							infoData.map((data, index) =>
								<WebPageData value={data.value} key={index} />
							)
						}
					</Stack>
				</Grid>
			</Stack>
		</Box>
	);
}
