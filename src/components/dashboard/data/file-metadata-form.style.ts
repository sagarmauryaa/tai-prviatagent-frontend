import { Card } from "@mui/material";
import { styled } from "@mui/material/styles";

export const FileUploadMetaDataModal = styled(Card)(({ theme }) => ({
	"&.file-modal-content": {
		[theme.breakpoints.down("md")]: {
			maxHeight: "calc(100vh - 40px)",
			overflowY: "auto",
		},
	},
}));
