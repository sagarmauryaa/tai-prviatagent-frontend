"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { getInfoDataById, updateInfoDataById } from "@/utils/backend-endpoints";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircularProgress, DialogActions, DialogTitle, FormControl, FormHelperText, InputLabel, OutlinedInput } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { X as XIcon } from "@phosphor-icons/react/dist/ssr/X";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

import { paths } from "@/paths";
import { useAuth } from "@/components/auth/auth-context";
import SpeechToText from "@/components/common/SpeechToText";
import { toast } from "@/components/core/toaster";

import PageLoader from "../layout/loader";
import MetaDataDialog from "./metadata-modal.style";

const schema = zod
	.object({
		text: zod.string().min(1, "Please enter some text.").optional().nullable(),
		sourceType: zod.string(),
	})
	.refine((data) => {
		if (data.sourceType === "text" && !data.text) {
			return false;
		}
		return true;
	});
const defaultValues = {
	text: "",
	sourceType: "text",
};

interface InfoDataType {
	brandId: string;
	createdTime: number;
	isDeleted: boolean;
	merchantId: string;
	metaDataCount: number;
	sourceType: string;
	text: string;
	updatedTime: number;
	_id: string;
}

export function InfoDataEditModal({ infoId, fetchData }: { infoId: string; fetchData: () => Promise<void> }) {
	const router = useRouter();
	const { selectedBrand, user } = useAuth();
	const [infoData, setInfoData] = React.useState<InfoDataType | null>(null);
	const [isPending, setIsPending] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(true);
	const [isSpeechMode, setIsSpeechMode] = React.useState(false);
	const [showConfirmClose, setShowConfirmClose] = React.useState(false);
	const handleClose = React.useCallback(() => {
		router.push(paths.dashboard.addData);
	}, [router]);

	const {
		control,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues,
		resolver: zodResolver(schema),
	});
	const onSubmit = React.useCallback(
		async (data: { text: string }) => {
			if (!selectedBrand?._id || !infoData?._id) {
				toast.error("Something went wrong!");
				return;
			}
			setIsPending(true);
			try {
				const { data: response, status } = await updateInfoDataById(selectedBrand?._id, infoData?._id, data.text ?? "");
				if (status === 200) {
					setIsPending(false);
					handleClose();
					fetchData();
				}
			} catch (error) {
				setIsPending(false);
				console.error(error);
				toast.error("Something went wrong!");
			}
		},
		[router, infoData, selectedBrand]
	);

	const getData = React.useCallback(
		async (id: string) => {
			if (!selectedBrand?._id || !id) {
				toast.error("Something went wrong!");
				return;
			}
			setIsLoading(true);
			try {
				const { data, status } = await getInfoDataById(selectedBrand?._id, id);
				if (status === 200) {
					const result = data?.data;
					setInfoData(result);
					setValue("text", result.text);
					setIsLoading(false);
				}
			} catch (error: any) {
				console.error("Error fetching brands:", error);
			}
		},
		[selectedBrand, infoId]
	);

	React.useEffect(() => {
		if (selectedBrand && infoId) {
			getData(infoId);
		}
	}, [selectedBrand, infoId]);

	const handleSpeechToText = (text: string) => {
		const currentText = watch("text") || "";
		setValue("text", currentText ? currentText + " " + text : text);
	};

	return (
		<>
			<MetaDataDialog
				maxWidth="sm"
				onClose={handleClose}
				open={Boolean(infoId)}
				sx={{
					"& .MuiDialog-container": { justifyContent: "center" },
					"& .MuiDialog-paper": { height: "100%", width: "100%" },
				}}
				className="metadata-modal"
			>
				<DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minHeight: 0 }}>
					{isLoading ? (
						<PageLoader />
					) : (
						<>
							<Stack
								direction="row"
								className="modal-header"
								sx={{
									alignItems: "center",
									flex: "0 0 auto",
									justifyContent: "space-between",
									position: "sticky",
									top: 0,
									backgroundColor: "white",
									padding: 2,
									zIndex: 3,
								}}
							>
								<Typography variant="h6" className="meta-data-id">
									ID-{infoData?._id}
								</Typography>
								<IconButton onClick={handleClose} className="modal-close close-edit-modal">
									<XIcon />
								</IconButton>
							</Stack>
							<Stack spacing={3} sx={{ paddingInline: 2 }} className="modal-content">
								<form onSubmit={handleSubmit(onSubmit)} className="edit-modal-form">
									<Stack spacing={3}>
										<Controller
											control={control}
											name="text"
											render={({ field }) => (
												<FormControl error={Boolean(errors.text)} fullWidth>
													<InputLabel className="edit-modal-label">Enter Text</InputLabel>
													<OutlinedInput
														multiline
														placeholder="Enter Text"
														{...field}
														sx={{ flex: "1 1 auto"}}
														className="edit-modal-input"
													/>
													{errors.text && <FormHelperText>{errors.text.message}</FormHelperText>}
												</FormControl>
											)}
										/>
										<Stack
											direction="row"
											spacing={2}
											sx={{
												justifyContent: "flex-end",
												position: "sticky",
												bottom: 0,
												backgroundColor: "white",
												padding: 2,
											}}
                                            className="edit-modal-actions"
										>
											{watch("text") && (
												<Button
													sx={{ mr: "auto" }}
													variant="outlined"
													color="primary"
													disabled={!watch("text")}
													onClick={() => setShowConfirmClose(true)}
												>
													Clear
												</Button>
											)}
											<SpeechToText onModeChange={setIsSpeechMode} onChange={handleSpeechToText} disabled={isPending} />
											<Button
												type="submit"
												sx={{ width: "fit-content" }}
												variant="contained"
												disabled={isPending || isSpeechMode}
												startIcon={isPending && <CircularProgress size={20} color="inherit" />}
											>
												{isPending ? "Updating..." : "Update"}
											</Button>
										</Stack>
									</Stack>
								</form>
							</Stack>
						</>
					)}
				</DialogContent>
			</MetaDataDialog>

			<Dialog open={showConfirmClose} onClose={() => setShowConfirmClose(false)}>
				<DialogTitle sx={{ fontWeight: "bold" }}>Are you sure?</DialogTitle>
				<DialogContent>
					<Typography>Are you sure you want to clear the text? This action cannot be undone.</Typography>
				</DialogContent>
				<DialogActions>
					<Button variant="outlined" onClick={() => setShowConfirmClose(false)}>
						Cancel
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={() => {
							setValue("text", "");
							setShowConfirmClose(false);
						}}
					>
						Clear
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

