import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";

const MetaDataDialog = styled(Dialog)(({ theme }) => ({
	"&.metadata-modal": {
		"&>.MuiDialog-container": {
			padding: theme.spacing(0, 2),
			"&>.MuiPaper-root": {
				overflow: "visible",
				borderRadius: theme.shape.borderRadius * 2.5,
				[theme.breakpoints.down("sm")]: {
					marginLeft: "0",
					marginRight: "0",
				},
			},
			".MuiDialogContent-root": {
				position: "relative",
				overflow: "visible",

				[theme.breakpoints.down("sm")]: {
					padding: theme.spacing(2),
				},
				".modal-header, .modal-content": {
					padding: theme.spacing(0, 0.5),
				},
				".modal-header": {
					".meta-data-id": {
						[theme.breakpoints.down("sm")]: {
							fontSize: theme.typography.subtitle1.fontSize,
						},
					},
					".modal-close": {
						background: "#8663e2",
						color: "#fff",
						position: "absolute",
						top: "-14px",
						right: "-12px",
						borderRadius: theme.shape.borderRadius * 3,
						[theme.breakpoints.down("sm")]: {
							padding: 0,
							width: theme.spacing(3.5),
							height: theme.spacing(3.5),
							fontSize: theme.typography.subtitle2.fontSize,
							top: "-10px",
							right: "-10px",
						},
						"&.close-edit-modal": {
							top: "-35px",
							right: "-35px",
							[theme.breakpoints.down("sm")]: {
								top: "-25px",
								right: "-25px",
							},
						},
					},
				},
				" .modal-content": {
					paddingBottom: "5px",
					overflow: "hidden",
					[theme.breakpoints.down("md")]: {
						gap: "15px",
					},
					".metadata-title-wrapper": {
						flexFlow: "row wrap",
						[theme.breakpoints.down("sm")]: {
							flexFlow: "row",
						},
						".metadata-title": {
							[theme.breakpoints.down("md")]: {
								fontSize: theme.typography.h5.fontSize,
							},
							[theme.breakpoints.down("sm")]: {
								fontSize: theme.typography.h6.fontSize,
							},
						},
					},
					".edit-modal-form": {
						".edit-modal-label": {
							[theme.breakpoints.down("sm")]: {
								fontSize: theme.typography.h6.fontSize,
							},
						},

						".edit-modal-input": {
							overflowY: "auto",
							maxHeight: "calc(100vh - 254px)",
						},
					},

					"&>.MuiPaper-root": {
						overflowY: "auto",
						//scrollbarWidth: "none",
						".MuiToolbar-root": {
							[theme.breakpoints.down("sm")]: {
								padding: theme.spacing(0, 1.5),
							},

							".MuiTablePagination-selectLabel , .MuiTablePagination-displayedRows": {
								[theme.breakpoints.down("sm")]: {
									fontSize: theme.typography.overline.fontSize,
								},
							},
							"&>.MuiTablePagination-select": {
								[theme.breakpoints.down("sm")]: {
									margin: theme.spacing(0, 0.5),
								},
							},
						},
					},
				},
			},
		},
	},
}));

export default MetaDataDialog;
