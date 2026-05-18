import { Box, styled } from "@mui/material";

export const MainNavWrapper = styled(Box)(({ theme }) => ({
	"&.header-main-wrapper": {
		header: {
			".header-container": {
				height:"80px",
				"@media screen and (max-width: 767px)": {
					height:"66px",
					paddingTop: theme.spacing(1.5),
					paddingBottom: theme.spacing(1.5),
				},
				".trial-expiration": {
					"@media screen and (max-width: 767px)": {
						position: "absolute",
						top: "0",
						left: "0",
						right: "0",
						borderRadius: "0",
						justifyContent: "center",
					},
				},
				".navicon-wrapper": {
					"@media screen and (max-width: 767px)": {
						gap: 0,
					},
					".hamburger-icon": {
						"@media screen and (max-width: 767px)": {
							padding: 0,
							width: "auto",
							height: "auto",
						},
					},
					".brands-dropdown": {
						"@media screen and (max-width: 767px)": {
							padding: theme.spacing(0, 1.5, 0, 1.5),
							"[role='combobox']": {
								width: "90px",
								overflow: "hidden",
								textOverflow: "ellipsis",
								whiteSpace: "nowrap",
							},
							"svg": {
								background: "#fff"
							}
						},
					},
				},
				".truncate-mobile": {
					"@media screen and (max-width: 767px)": {
						maxWidth: "120px",
					},
				},

			},
		},
		"&.trial-plan": {
			"@media screen and (max-width: 767px)": {
				paddingTop: theme.spacing(2.5),
			},
			".header-container": {
				"@media screen and (max-width: 767px)": {
					paddingTop: theme.spacing(2.5),
				},
			},
		},
	},
}));
