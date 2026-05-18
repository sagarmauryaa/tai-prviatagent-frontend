"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { addInfoDataPDF } from "@/utils/backend-endpoints";
import { zodResolver } from "@hookform/resolvers/zod"; 
import {
	Alert, 
	Button,
	Card,
	CardActions,
	CardContent, 
	CircularProgress,
	FormControl,
	FormHelperText,  
} from "@mui/material"; 
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

import { useAuth } from "@/components/auth/auth-context";
import { FileDropzone } from "@/components/core/file-dropzone";
import { toast } from "@/components/core/toaster";

import UploadingProcessing from "./uploading-processing";

const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB in bytes

const schema = (remainingSize: number) =>
	zod.object({
		file: zod
			.custom<File | undefined | null>()
			.nullable()
			.refine((file) => file !== undefined && file != null, "Please select a file")
			.refine((file) => {
				if (!file) return false;
				const fileSizeInMB = file.size;
				return fileSizeInMB <= remainingSize;
			}, `File is too large. Maximum size is ${remainingSize}MB`)
			.refine((file) => {
				if (!file) return false;
				return file.size <= MAX_FILE_SIZE;
			}, "File is too large. Maximum size is 200MB")
			.refine((file) => (file ? file.type === "application/pdf" : false), "Only PDF files are allowed")
			.refine((file) => {
				if (!file) return false;
				return !file.name.includes(".exe");
			}, "Executable files are not allowed"),
	});

type FormValues = { file: File | undefined | null };

const defaultValues = {
	file: null,
};

const FileUploadForm = ({ fetchData }: { fetchData: () => Promise<void> }) => {
	const router = useRouter(); 
	const { selectedBrand, user, currentSubscription, updateDataSize } = useAuth();

	const remainingSize = currentSubscription
		? currentSubscription.totalDatasize * (1024 * 1024) - currentSubscription.dataSize
		: 0;

	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues,
		resolver: zodResolver(schema(remainingSize)),
	});

	const [isPending, setIsPending] = React.useState(false);

	const handleFileUpload = React.useCallback(
		async (files: File[]) => {
			if (!currentSubscription) {
				toast.error("Subscription data not available");
				return;
			}
			try {
				if (!files || files.length === 0) {
					toast.error("No file selected");
					return;
				}

				const file = files[0];

				// Additional validations
				if (file.size === 0) {
					toast.error("Empty file is not allowed");
					return;
				}
				if (!currentSubscription?.totalDatasize && !currentSubscription?.dataSize) {
					toast.error("Subscription data not available");
					return;
				}

				if (file.name.length > 255) {
					toast.error("File name is too long");
					return;
				}
				const remainingSize = currentSubscription.totalDatasize * (1024 * 1024) - currentSubscription.dataSize;
				const fileSizeInMB = file.size;
				if (fileSizeInMB > remainingSize) {
					toast.error(`File size exceeds remaining storage limit of ${remainingSize}MB`);
					return;
				} else {
					const dataTransfer = new DataTransfer();
					dataTransfer.items.add(file);
					setValue("file", dataTransfer.files[0]);
				}
			} catch (error) {
				console.error("File upload error:", error);
				toast.error("Error processing file");
			}
		},
		[setValue, currentSubscription]
	);
	const abortController = React.useRef<AbortController | null>(null);
	const onSubmit = React.useCallback(
		async (data: FormValues) => {
			if (!user?.userId || !selectedBrand?._id || !data.file) {
				toast.error("Missing required information");
				return;
			}
			setIsPending(true);
			// Create new AbortController for this upload
			abortController.current = new AbortController();
			try {
				if (!currentSubscription?.totalDatasize && !currentSubscription?.dataSize) {
					toast.error("Subscription data not available");
					setValue("file", null);
					return;
				}
				const { data: response, status } = await addInfoDataPDF({
					userId: user.userId,
					brandId: selectedBrand._id,
					pdf: data.file,
					signal: abortController.current.signal,
				});
				if (status === 200) {
					toast.success("File uploaded and processed successfully!");
					fetchData();
					if (currentSubscription) {
						const fileSize = data.file.size;
						updateDataSize(fileSize);
					}
					setValue("file", null);
				} else {
					throw new Error("Upload failed");
				}
			} catch (error: any) {
				console.error("Upload error:", error?.message);
				toast.error(error.message ?? "Upload failed");
			} finally {
				abortController.current = null;
				setIsPending(false);
			}
		},
		[selectedBrand, user, setValue, router, currentSubscription]
	);
	const handleAbort = React.useCallback(() => {
		if (abortController.current) {
			toast.error("Upload cancelled");
			abortController.current.abort();
			abortController.current = null;
		}
	}, []);

	return (
		<>
			<Card className="adddata-content">
				<form onSubmit={handleSubmit(onSubmit)}>
					<CardContent className="common-textarea">
						<Controller
							control={control}
							name="file"
							render={({ field: { onChange, value, ...field } }) => (
								<FormControl error={Boolean(errors.file)} fullWidth>
									<FileDropzone
										acceptedFiles={{
											"application/pdf": [".pdf"],
										}}
										maxSize={MAX_FILE_SIZE}
										defaultFiles={value ? [value as File] : []}
										caption="PDF files only | Max 200MB"
										onDrop={handleFileUpload}
										{...field}
									/>
									{errors.file && <FormHelperText error>{errors.file.message as string}</FormHelperText>}
								</FormControl>
							)}
						/>
						{errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
					</CardContent>
					<CardActions sx={{ justifyContent: "flex-end" }} className="add-data-cta">
						<Button
							type="submit"
							variant="contained"
							disabled={isPending || remainingSize <= 0}
							startIcon={isPending && <CircularProgress size={20} color="inherit" />}
						>
							{isPending ? "Uploading..." : "Upload"}
						</Button>
					</CardActions>
				</form>
				<UploadingProcessing loading={isPending} onCancel={handleAbort} />
			</Card>
		</>
	);
};

export default FileUploadForm;
