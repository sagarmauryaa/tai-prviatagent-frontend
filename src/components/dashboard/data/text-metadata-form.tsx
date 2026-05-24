import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { addTextMetaData, generateMetaData, updateTextMetaData } from "@/utils/backend-endpoints";
import { getTextDataSize } from "@/utils/get-data-size";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Button,
	Card,
	CardActions,
	CardContent,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	FormHelperText,
	InputLabel,
	Modal,
	OutlinedInput,
	Typography,
} from "@mui/material";
import { Box, maxWidth, Stack, width } from "@mui/system";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";
import { X as XIcon } from "@phosphor-icons/react/dist/ssr/X";
import { useAuth } from "@/components/auth/auth-context";
import SpeechToText from "@/components/common/SpeechToText";
import { toast } from "@/components/core/toaster";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import { FileUploadMetaDataModal } from "./file-metadata-form.style";

const schema = zod.object({
	name: zod.string().min(1, "Name is required"),
	value: zod.string().min(1, "Value is required"),
	type: zod.string().min(1, "Type is required"),
	description: zod.string().optional(),
	isAIGenerated: zod.boolean().optional(),
});

const defaultValues = {
	name: "",
	value: "",
	description: "",
	type: "text",
	isAIGenerated: false,
};

const MODAL_STYLE = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	maxWidth: "500px",
	width: "100%",
	padding: "0 15px",
};
interface FormDataTypes {
	_id?: string;
	name: string;
	value: string;
	description: string;
	isAIGenerated: boolean;
	type: string;
}

interface TextFormTypes {
	open: boolean;
	infoId: string;
	handleModal: (status: boolean) => void;
	handleFetch: () => Promise<void>;
	data?: FormDataTypes | null;
}

const TextMetadataForm: React.FC<TextFormTypes> = ({
	open,
	infoId,
	handleModal = () => { },
	data = null,
	handleFetch,
}) => {
	const router = useRouter();
	const { selectedBrand } = useAuth();
	const [isPending, setIsPending] = React.useState(false);
	const [isSpeechMode, setIsSpeechMode] = React.useState(false);
	const [showConfirmClose, setShowConfirmClose] = React.useState(false);
	const [isGenerating, setIsGenerating] = React.useState(false);


	const {
		control,
		handleSubmit,
		watch,
		setValue,
		getValues,
		clearErrors,
		formState: { errors },
	} = useForm({
		defaultValues,
		resolver: zodResolver(schema),
	});

	const handleGenerate = React.useCallback(async () => {
		const name = getValues("name"); // RHF API
		const value = getValues("value"); // RHF API
		const description = getValues("description"); // RHF API


		setIsGenerating(true);
		try {
			const payload = { name, value, description };
			const response = await generateMetaData(infoId, payload);
			const { data, status } = response.data;

			if (status === 200) {
				// setValue("name", data.meta_title ?? '');
				setValue("description", data.meta_description ?? '');
				setValue("isAIGenerated", true);
				toast.success("Text data generated!");
			}
		} catch (error) {
			console.error(error);
			toast.error("Something went wrong!");
		} finally {
			setIsGenerating(false);
		}
	}, [selectedBrand, router, handleModal, infoId, data]);

	const onSubmit = React.useCallback(
		async (formData: FormDataTypes) => {
			if (!formData.name || !formData.value || !selectedBrand?._id) {
				toast.error("Fill required field!");
				return;
			}
			setIsPending(true);
			try {
				const payload = { ...formData, brandId: selectedBrand._id };

				const apiResponse = data?._id
					? await updateTextMetaData(data._id, payload)
					: await addTextMetaData(infoId, payload);

				const { data: response, status } = apiResponse;
				if (status === 200) {
					setIsPending(false);
					setValue("name", "");
					setValue("description", "");
					setValue("value", "");
					handleModal(false);
					handleFetch();
					toast.success(`Text metadata ${data?._id ? "updated" : "added"} successfully`);
				}
			} catch (error) {
				setIsPending(false);
				console.error(error);
				toast.error("Something went wrong!");
			}
		},
		[selectedBrand, router, handleModal, infoId, data]
	);

	React.useEffect(() => {
		if (data) {
			setValue("description", data.description);
			setValue("name", data.name);
			setValue("value", data.value);
		}
	}, [data]);

	const handleSpeechToText = (text: string) => {
		const currentText = watch("description") || "";
		setValue("description", currentText ? currentText + " " + text : text);
	};

	useEffect(() => {
		if (!open) { 
			setValue('name', '');
			setValue('isAIGenerated', false);
			setValue('value', '');
			setValue('description', '');
		}
	}, [open])

	return (
		<>
			<Modal
				open={open}
				onClose={() => {
					handleModal(false);
					clearErrors();
				}}
				aria-labelledby="delete-confirmation-modal"
				className="addmeta-modal meta-modal"
			>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Box sx={MODAL_STYLE} className="addmeta-modal-content">
						<FileUploadMetaDataModal sx={{ width: "100%" }} className="file-modal-content">
							<CardContent>
								<Stack spacing={3}>
									<Typography className="modal-heading" variant="h5">
										{data ? "Edit" : "Add"} MetaData
									</Typography>
									<Controller
										control={control}
										name="name"
										render={({ field }) => (
											<FormControl error={Boolean(errors.name)} fullWidth>
												<InputLabel required>Name</InputLabel>
												<OutlinedInput placeholder="Enter name" {...field} />
												{errors.name && <FormHelperText>{errors.name.message}</FormHelperText>}
											</FormControl>
										)}
									/>
									<Controller
										control={control}
										name="value"
										render={({ field }) => (
											<FormControl error={Boolean(errors.value)} fullWidth>
												<InputLabel required>Value</InputLabel>
												<OutlinedInput rows={4} placeholder="Enter value" {...field} />
												{errors.value && <FormHelperText>{errors.value.message}</FormHelperText>}
											</FormControl>
										)}
									/>
									<Controller
										control={control}
										name="description"
										render={({ field }) => (
											<FormControl error={Boolean(errors.description)} fullWidth>
												<Stack spacing={3} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
													<InputLabel>Description</InputLabel>
													<Button
														variant="contained" className="ai-btn"
														sx={{ marginInlineStart: 'auto !important', marginBlockEnd: 1 }}
														onClick={handleGenerate}
														disabled={isGenerating || isSpeechMode || isPending}
													>
														{isGenerating ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}<span>Rewrite with AI</span>
													</Button>

												</Stack>
												<OutlinedInput multiline rows={4} placeholder="Enter description" {...field} />
												{errors.description && <FormHelperText>{errors.description.message}</FormHelperText>}
											</FormControl>
										)}
									/>
								</Stack>
							</CardContent>
							<CardActions sx={{ justifyContent: "flex-end", gap: "5px" }}>
								{watch("description") && (
									<Button
										sx={{ mr: "auto" }}
										variant="outlined"
										color="primary"
										disabled={!watch("description") || isGenerating}
										onClick={() => setShowConfirmClose(true)}
									>
										Clear
									</Button>
								)}
								<Button
									type="button"
									sx={{ width: "fit-content", ml: "auto" }}
									variant="text"
									onClick={() => handleModal(false)}
									className="modal-close"

								>
									<XIcon />
								</Button>

								<SpeechToText onModeChange={setIsSpeechMode} onChange={handleSpeechToText} disabled={isPending} />
								<Button
									type="submit"
									sx={{ width: "fit-content", ml: "auto" }}
									variant="contained"
									disabled={isPending || isGenerating || isSpeechMode}
									startIcon={isPending && <CircularProgress size={20} color="inherit" />}
								>
									{isPending ? "Submitting..." : "Submit"}
								</Button>
							</CardActions>
						</FileUploadMetaDataModal>
					</Box>
				</form>
			</Modal>
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
							setValue("description", "");
							setShowConfirmClose(false);
						}}
					>
						Clear
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default TextMetadataForm;
