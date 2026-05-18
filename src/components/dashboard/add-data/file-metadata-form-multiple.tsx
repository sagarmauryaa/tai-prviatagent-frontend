import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { addFileMetaData, addFilesMetaData, generateMetaData, updateFileMetaData } from "@/utils/backend-endpoints";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Button,
	Card,
	CardActionArea,
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
	Select,
	Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { X as XIcon } from "@phosphor-icons/react/dist/ssr/X";

import { useAuth } from "@/components/auth/auth-context";
import SpeechToText from "@/components/common/SpeechToText";
import { FileDropzone } from "@/components/core/file-dropzone-with-progress";
import { toast } from "@/components/core/toaster";

import { FileUploadMetaDataModal } from "./file-metadata-form.style";
import { AxiosProgressEvent } from "axios";

const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB in bytes


const schema = z.object({
	files: z
		.array(z
			.instanceof(File)
			.refine(file => file.size <= MAX_FILE_SIZE, { message: "File too large." })
			.refine(file => file.name.length <= 255, { message: "File name too long." })
			.refine(file => ["application/pdf", "image/png", "image/jpeg", "image/gif", "video/mp4", "video/avi", "video/quicktime", "video/x-ms-wmv"].includes(file.type), { message: "Invalid file type." })
		)
		.min(1, { message: "Select at least one file." }),
	name: z.string().trim().min(1, { message: "Please enter name." }),
	description: z.string().optional(),
	type: z.enum(["video", "pdf", "image"]).optional(),
	isAIGenerated: z.boolean().optional(),
});

type FormDataTypes = z.infer<typeof schema>;


const defaultValues: Partial<FormDataTypes> = {
	files: [], // Ensures correct typing
	name: "",
	description: "",
	isAIGenerated: false,
	type: undefined,
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

interface InfoDataType {
	_id: string;
	brandId: string;
	name: string;
	type: "video" | "pdf" | "image" | undefined;
	description: string;
	S3Url: string;
	createdTime: number;
	updatedTime: number;
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

	const { control, handleSubmit, watch, getValues, setValue, clearErrors, reset, formState: { errors } } = useForm<FormDataTypes>({
		defaultValues,
		resolver: zodResolver(schema),
	});
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
			if (!formData.files || formData.files.length === 0) {
				toast.error("Please select at least one file!");
				return;
			}

			setIsPending(true);
			try {
				const uploadPromises = formData.files.map(async (file) => {

					if (data?._id) {
						const payload = {
							...formData,
							brandId: selectedBrand._id,
						};

						// Update existing metadata (usually single metadata update)
						return await updateFileMetaData(data._id, payload as { brandId: string; type: string; name: string; description: string; file?: File })
					} else {
						// For add: detect fileType and build correct payload
						const fileTypeMap: Record<string, "video" | "pdf" | "image" | undefined> = {
							"application/pdf": "pdf",
							"image/jpeg": "image",
							"image/png": "image",
							"image/gif": "image",
							"video/mp4": "video",
							"video/quicktime": "video",
						};
						const detectedType = fileTypeMap[file.type];
						if (!detectedType) {
							throw new Error(`Unsupported file type: ${file.type}`);
						}

						const payload = {
							...formData,
							brandId: selectedBrand._id,
							type: detectedType as string, // ensure type is string
							file
						};

						const config = {
							onUploadProgress: (e: AxiosProgressEvent) => {
								onUploadProgress(e, file); // use file to track progress
							}
						};
						// Add new metadata with file upload
						return await addFileMetaData(
							infoId,
							payload as { brandId: string; type: string; name: string; description: string; file: File },
							config
						);

					}
				});

				const responses = await Promise.all(uploadPromises);

				if (responses.every(res => res.status === 200)) {
					setIsPending(false);
					setValue("name", "");
					setValue("description", "");
					// setValue("type", "");
					setValue("files", []);
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
	const onUploadProgress = (progressEvent: AxiosProgressEvent, file: File) => {
		const { loaded, total } = progressEvent;
		const percent = Math.round((loaded * 100) / (total ?? file.size));
		setProgress((prev) => ({ ...prev, [file.name]: percent }));
		// console.log('progress', file.name, percent);
	}

	// console.log("uploadProgress", uploadProgress); 
	React.useEffect(() => {

		if (data) {
			setValue("description", data.description);
			setValue("name", data.name);
			setValue("type", data.type);

			// Optional: if you want to show file info, store a 'preview' object, not a real File.
			// Avoid creating an empty File just to fit the form, instead show info in UI.
			const fileName = data.S3Url?.split("/").pop() || "";
			const fileTypeMap: Record<string, string> = {
				pdf: "application/pdf",
				image: "image/png",
				video: "video/mp4",
			};
			if (data.type) {
				const fileMimeType = fileTypeMap[data.type] || "application/octet-stream";
				if (fileName && fileMimeType) {
					const file = new File([], fileName, { type: fileMimeType });
					console.log('file', file);

					setDataFile(file); // create a dummy File object for display
					setValue('files', [file]);
				}
			}
		} else {
			reset({
				files: [],
				name: "",
				description: "",
				type: undefined,
			});
			setDataFile(null);
		}
	}, [data, setValue, reset]);


	const handleFilesDrop = (files: File[]) => {
		if (files.length) {
			setValue("files", files);
			clearErrors("files");
		} else {
			toast.error("No files selected.");
		}
	};

	const handleSpeechToText = (text: string) => {
		const current = watch("description") || "";
		setValue("description", current ? `${current} ${text}` : text);
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
				aria-labelledby="form-modal"
				className="file-upload-modal addmeta-modal meta-modal"
			// className=""
			>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Box sx={MODAL_STYLE}>
						<FileUploadMetaDataModal sx={{ width: "100%" }} className="file-modal-content">
							<CardContent>
								<Stack spacing={3}>
									<Typography className="modal-heading" variant="h5">
										{data ? "Edit" : "Add"} MetaData
									</Typography>

									{!data && (
										<Controller
											control={control}
											name="files"
											render={({ field: { onChange, value, ...field } }) => (
												<FormControl error={Boolean(errors.files)} fullWidth>
													<InputLabel sx={{ mb: 1 }}>Upload Files</InputLabel>
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
														onDrop={handleFilesDrop}
														{...field}
													/>
													{errors.files && <FormHelperText error>{errors.files.message as string}</FormHelperText>}
												</FormControl>
											)}
										/>
									)}
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
										name="description"
										render={({ field }) => (
											<FormControl error={Boolean(errors.description)} fullWidth>
												<Stack spacing={3} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
													<InputLabel>Description</InputLabel>
													<Button
														type="button"
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
							<CardActions sx={{ justifyContent: "flex-end" }}>
								{!data && watch("description") && (
									<Button
										sx={{ mr: "auto" }}
										variant="outlined"
										color="primary"
										disabled={!watch("description") || isPending || isGenerating || isSpeechMode}
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

								<Button
									type="button"
									sx={{ width: "fit-content", ml: "auto" }}
									variant="text"
									onClick={() => handleModal(false)}
									disabled={isPending || isGenerating || isSpeechMode}
								>
									Cancel
								</Button>
								{!data && <SpeechToText onModeChange={setIsSpeechMode} onChange={handleSpeechToText} disabled={isPending || isGenerating} />}
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

export default FileMetadataForm;
