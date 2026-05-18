import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { fontSize } from "@mui/system";

const UploadFileButtonWrapper = styled(Box)(({ theme }) => ({
	"&.upload-file": {
		[theme.breakpoints.down("sm")]: {
			padding: "20px",
		},
		"&>.file-icon-wrapper": {
			[theme.breakpoints.down("sm")]: {
				flexWrap: "wrap",
				gap: theme.spacing(2),
				justifyContent: "center",
				textAlign: "center",
			},
			".upload-title": {
				[theme.breakpoints.down("sm")]: {
					fontSize: "16px",
				},
			},
		},
	},
}));

export default UploadFileButtonWrapper;
