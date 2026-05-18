import { Box, styled } from "@mui/material";

export const DashboardFilters = styled(Box)(({ theme }) => ({
	"&.filter-wrapper": {
		[theme.breakpoints.down("sm")]: {
			width: "100%",
		},

        '& .filter-dropdown':{
            [theme.breakpoints.down("sm")]: {
			width: "100%",
            maxWidth:`calc(100%/2 - ${theme.spacing(1)})`,
		},
        }
	},
}));
