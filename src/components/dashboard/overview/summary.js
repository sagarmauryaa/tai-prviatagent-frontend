import * as React from "react"; 
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent"; 
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography"; 
import { SummaryCard } from "./summary.style";

export function Summary({ value, title}) {
	return (
		<SummaryCard className="summary-card" >
			<CardContent>
				<Stack direction="column" spacing={1} > 
						<Typography color="text.secondary" variant="body2" className="summary-title">
							{title}
						</Typography>
						<Typography variant="h5" className="summary-description">{value}</Typography> 
				</Stack>
			</CardContent>
		</SummaryCard>
	);
}
