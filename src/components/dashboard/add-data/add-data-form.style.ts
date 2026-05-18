import { Stack, styled } from "@mui/material";

const AddDataButton = styled(Stack)(({ theme }) => ({
	"&.add-btn-wrapper": {
		[theme.breakpoints.down("sm")]: {
			flexWrap: "wrap",
		},
		"& .MuiButton-root": {
			position: "relative",
			overflow: "visible",
			[theme.breakpoints.down("md")]: {
				padding: "5px 10px",
			},
			[theme.breakpoints.down("sm")]: {
				maxWidth: "calc(100%/2 - 4px)",
				lineHeight: "100%",
				padding: "12px 5px",
			},
			".exclamation-icon": {
				position: "absolute",
				top: "-10px",
				right: "-4px",
				width: "25px",
				height: "25px",
				background: "red",
				borderRadius: "999px",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				paddingTop: "1px",
				paddingLeft: "1px",
                color:'#fff',
			},
		},
	},
}));

export default AddDataButton;
