import { Box, styled } from "@mui/material";
import { display, padding } from "@mui/system";

export const SearchTableWrapper = styled(Box)(({ theme }) => ({
	"&.search-table-wrapper": {
		"& .search-bar": {
			position: "sticky",
			left: 0,
			"& .table-data-search": {
				[theme.breakpoints.down("sm")]: {
					width: "100%",
				},
			},
		},
		"& .table-pagination": {
			"& .MuiToolbar-root": {
				[theme.breakpoints.down("sm")]: {
					flexWrap: "wrap",
					padding: "0 16px",
					justifyContent: "space-between",
				},

				"&>.MuiTablePagination-select": {
					[theme.breakpoints.down("sm")]: {
						margin: "0 8px",
					},
				},
				"&>.MuiTablePagination-actions": {
					[theme.breakpoints.down("sm")]: {
						margin: 0,
					},
					"&>.MuiIconButton-root": {
						padding: "0 5px",
						width: "auto",
						height: "auto",
					},
				},
				".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
					fontSize: "13px",
				},
			},
		},
	},
}));
