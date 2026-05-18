import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { addFileMetaData, generateMetaData, updateFileMetaData } from "@/utils/backend-endpoints";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Button,
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
import { Box, Stack } from "@mui/system";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { X as XIcon } from "@phosphor-icons/react/dist/ssr/X";
import { useAuth } from "@/components/auth/auth-context";
import SpeechToText from "@/components/common/SpeechToText";
import { FileDropzone } from "@/components/core/file-dropzone-with-progress";
import { toast } from "@/components/core/toaster";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import { FileUploadMetaDataModal } from "./file-metadata-form.style";

const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB in bytes
const schema = (data: any) =>
	z
		.object({
			file: data
				? z.instanceof(File).optional()
				: z
					.instanceof(File, { message: "File is required." })
					.refine((file) => file.size > 0, { message: "Please select a file." })
					.refine((file) => file.name.length <= 255, { message: "File name is too long." })
					.refine(
						(file) => {
							const validTypes = [
								"application/pdf",
								"image/png",
								"image/jpeg",
								"image/gif",
								"video/mp4",
								"video/avi",
								"video/quicktime",
								"video/x-ms-wmv",
							];
							return validTypes.includes(file.type);
						},
						{
							message:
								"Invalid file type. Only PDF, images (PNG, JPG, JPEG, GIF), and videos (MP4, AVI, MOV, WMV) are allowed.",
						}
					)
					.nullable()
					.or(z.literal(undefined)),
			name: z.string().trim().min(1, { message: "Please enter name." }),
			// description: z.string().trim().min(1, { message: "Please enter description." }),
			description: z.string().optional(),
			type: z.enum(["video", "pdf", "image"]).optional(),
			isAIGenerated: z.boolean().optional(),
		})
		.refine(
			(values) => {
				// Ensure either file or type is provided when `data` is null (new upload case)
				return data || values.file;
			},
			{
				message: "Please select a file.",
				path: ["file"],
			}
		);

const defaultValues: Partial<FormDataTypes> = {
	file: undefined, // Ensures correct typing
	name: "",
	description: "",
	isAIGenerated: false,
	type: "",
};

const MODAL_STYLE = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	maxWidth: "700px",
	width: "100%",
	padding: "0 15px",
};

interface FormDataTypes {
	brandId: string;
	_id?: string | undefined;
	name?: string | undefined;
	description?: string | undefined;
	isAIGenerated?: boolean;
	file?: File | undefined;
	type?: "" | "video" | "image" | "pdf" | undefined;
}
interface InfoDataType {
	_id: string;
	brandId: string;
	name: string;
	type: "video" | "pdf" | "image" | "";
	description: string;
	S3Url: string;
	createdTime: number;
	updatedTime: number;
	onUploadProgress?: (progressEvent: ProgressEvent) => void;
}
interface FileFormTypes {
	open: boolean;
	infoId: string;
	handleModal: (status: boolean) => void;
	handleFetch: () => Promise<void>;
	data?: InfoDataType | null;
}

const FileMetadataForm: React.FC<FileFormTypes> = ({
	open,
	infoId = "1",
	handleModal = () => { },
	data = null,
	handleFetch,
}) => {
	const router = useRouter();
	const { selectedBrand, currentSubscription, updateDataSize } = useAuth();
	const [isPending, setIsPending] = React.useState(false);
	const [isSpeechMode, setIsSpeechMode] = React.useState(false);
	const [showConfirmClose, setShowConfirmClose] = React.useState(false);
	const [datFile, setDataFile] = React.useState<File | null>(null);
	const [progress, setProgress] = React.useState<Record<string, number>>({});
	const [isGenerating, setIsGenerating] = React.useState(false);


	const {
		control,
		handleSubmit,
		watch,
		setValue,
		getValues,
		clearErrors,
		formState: { errors },
		reset,
	} = useForm({
		defaultValues,
		resolver: zodResolver(schema(data ?? null)),
	});

	const handleFileUpload = React.useCallback(
		(files: File[]) => {
			if (!files?.length) {
				toast.error("No file selected.");
				return;
			}

			const file = files[0];

			const fileTypeMap: Record<string, "video" | "pdf" | "image" | undefined> = {
				"application/pdf": "pdf",
				"image/jpeg": "image",
				"image/png": "image",
				"image/gif": "image",
				"video/mp4": "video",
				"video/quicktime": "video",
			};

			const fileType = fileTypeMap[file.type];

			if (!fileType) {
				toast.error("Invalid file type. Only PDF, images, or videos are allowed.");
				return;
			}
			clearErrors("file");
			setValue("file", file);
			setValue("type", fileType);
		},
		[setValue]
	);

	const handleGenerate = React.useCallback(async () => {
		const name = getValues("name") ?? ''; // RHF API 
		const description = getValues("description") ?? ''; // RHF API
		const value = '';

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
		async (formData: Partial<FormDataTypes>) => {
			if (!selectedBrand?._id) {
				toast.error("Fill required field!");
				return;
			}

			setIsPending(true);
			try {
				const payload = {
					...formData, brandId: selectedBrand._id,
				};
				console.log('payload::', payload);

				const apiResponse = data?._id
					? await updateFileMetaData(data._id, payload as InfoDataType)
					: await addFileMetaData(infoId, payload as InfoDataType & { file: File });

				if (apiResponse.status === 200) {
					setIsPending(false);
					setValue("name", "");
					setValue("description", "");
					setValue("type", "");
					setValue("file", undefined as unknown as File);
					handleModal(false);
					handleFetch();
					toast.success(`File metadata ${data?._id ? "updated" : "added"} successfully`);
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
			setValue("type", data.type);

			const fileName = data.S3Url?.split("/").pop() || "";
			const fileTypeMap: Record<string, string> = {
				pdf: "application/pdf",
				image: "image/png",
				video: "video/mp4",
			};
			const fileMimeType = fileTypeMap[data.type] || "application/octet-stream";
			setDataFile(new File([], fileName, { type: fileMimeType }));
			schema(data);
		}
	}, [data]);
	React.useEffect(() => {
		if (!data) {
			reset({
				file: undefined,
				name: "",
				description: "",
				type: undefined,
			});
		}
	}, [data, reset]);

	const handleSpeechToText = (text: string) => {
		const currentText = watch("description") || "";
		setValue("description", currentText ? currentText + " " + text : text);
	};

	useEffect(() => {
		if (!open) {
			setValue('name', '');
			setValue('isAIGenerated', false);
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
				sx={{ zIndex: '9999' }}
				aria-labelledby="form-modal"
				className="file-upload-modal meta-modal"
			>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Box sx={MODAL_STYLE}>
						<FileUploadMetaDataModal sx={{ width: "100%" }} className="file-modal-content">
							<CardContent>
								<Stack spacing={3}>
									<Typography className="modal-heading" variant="h5">
										{data ? "Edit" : "Add"} Meta Data
									</Typography>

									{!data && (
										<Controller
											control={control}
											name="file"
											render={({ field: { onChange, value, ...field } }) => (
												<FormControl error={Boolean(errors.file)} fullWidth>
													<InputLabel sx={{ mb: 1 }}>Upload File</InputLabel>
													<FileDropzone
														progress={progress}
														acceptedFiles={{
															"application/pdf": [".pdf"],
															"image/png": [".png"],
															"image/jpeg": [".jpg", ".jpeg"],
															"video/*": [".mp4", ".avi", ".mov", ".wmv"],
														}}
														maxSize={MAX_FILE_SIZE}
														caption="Accepted files: PDF, Images (PNG, JPG, JPEG, GIF), Videos (MP4, AVI, MOV, WMV)"
														onDrop={handleFileUpload}
														{...field}
													/>
													{errors.file && <FormHelperText error>{errors.file.message as string}</FormHelperText>}
												</FormControl>
											)}
										/>
									)}
									<Controller
										control={control}
										name="name"
										render={({ field }) => (
											<FormControl error={Boolean(errors.name)} fullWidth>
												<InputLabel required>Enter metadata name</InputLabel>
												<OutlinedInput placeholder="Enter name" {...field} />
												{errors.name && <FormHelperText>{errors.name.message}</FormHelperText>}
											</FormControl>
										)}
									/>
									<Controller
										control={control}
										name="description"
										render={({ field }) => (
											<FormControl error={Boolean(errors.description)} fullWidth>
												<Stack spacing={3} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
													<InputLabel>Enter metadata description</InputLabel>
													<Button
														type="button"
														variant="contained" className="ai-btn"
														sx={{ marginInlineStart: 'auto !important', marginBlockEnd: 1 }}
														onClick={handleGenerate}
														disabled={isGenerating || isSpeechMode || isPending}
													>
														{isGenerating ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}&nbsp;&nbsp;Rewrite with AI
													</Button>
												</Stack>

												<OutlinedInput multiline rows={4} placeholder="Enter description" {...field} />
												{errors.description && <FormHelperText>{errors.description.message}</FormHelperText>}
											</FormControl>
										)}
									/>
								</Stack>
							</CardContent>
							<CardActions sx={{ justifyContent: "flex-end" }}>
								{watch("description") && (
									<Button
										sx={{ mr: "auto" }}
										variant="outlined"
										color="primary"
										disabled={!watch("description")}
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
									disabled={isPending || isSpeechMode}
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

export default FileMetadataForm;
