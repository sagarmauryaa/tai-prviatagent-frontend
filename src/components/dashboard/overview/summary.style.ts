import { Card, styled } from "@mui/material";
import { fontSize, minHeight } from "@mui/system";

export const SummaryCard = styled(Card)(({ theme }) => ({
	"&.summary-card": {
		[theme.breakpoints.down("sm")]: {
			borderRadius: theme.shape.borderRadius * 1.5,
		},
		"&>.MuiCardContent-root": {
			[theme.breakpoints.down("sm")]: {
				padding: theme.spacing(2, 1.5, 3),
				height: "100%",
			},
			"& .summary-title": {
				[theme.breakpoints.down("sm")]: {
				minHeight:theme.spacing(5.5),
                
				},
			},
			".summary-description": {
				[theme.breakpoints.down("sm")]: {
                    fontSize: theme.typography.subtitle1.fontSize,
                },
			},
		},
	},
}));
