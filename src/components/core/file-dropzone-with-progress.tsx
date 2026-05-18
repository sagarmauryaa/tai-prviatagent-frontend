"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CloudArrowUp as CloudArrowUpIcon } from "@phosphor-icons/react/dist/ssr/CloudArrowUp";
import { X as XIcon } from "@phosphor-icons/react/dist/ssr/X";
import { Accept, useDropzone } from "react-dropzone";

import { useAuth } from "../auth/auth-context";
import UploadFileButtonWrapper from "./file-dropzone.styles";
import { LinearProgress } from "@mui/material";

interface FileDropzoneProps {
	caption?: string;
	maxSize?: number;
	defaultFiles?: File[];
	progress?: Record<string, number>
	acceptedFiles?: Accept;
	onError?: (error: string) => void;
	onDrop?: (acceptedFiles: File[], rejectedFiles: any[]) => void;
}

export function FileDropzone({
	caption,
	defaultFiles,
	maxSize = 5242880,
	acceptedFiles = {},
	progress = {},
	onError,
	...props
}: FileDropzoneProps) {
	const [error, setError] = React.useState<string | null>(null);
	const [files, setFiles] = React.useState<File[]>(defaultFiles ? Array.from(defaultFiles) : []);
	const [uploadProgress, setUploadProgress] = React.useState<Record<string, number>>(progress);
	const { currentSubscription } = useAuth();
 

	const remainingSize = Math.max(
		currentSubscription ? currentSubscription.totalDatasize * 1024 * 1024 - currentSubscription.dataSize : 0,
		0
	);

	const onDropHandler = React.useCallback(
		(acceptedFiles: File[], rejectedFiles: any[]) => {
			const errors: string[] = [];
			if (currentSubscription) {
				const getDataLimitMessage = (file: File) => {
					const dataLimit = (currentSubscription.totalDatasize * 1024 * 1024) - currentSubscription.dataSize;
					return `You only have ${(dataLimit / 1024 / 1024).toFixed(2)}MB data storage available. The file "${file.name}" exceeds this limit. Upgrade your plan to increase storage.`;
				};

				acceptedFiles.forEach((file) => {
					if (
						currentSubscription &&
						file.size > (currentSubscription.totalDatasize * 1024 * 1024) - currentSubscription.dataSize
					) {
						errors.push(getDataLimitMessage(file));
					} else if (file.size > maxSize) {
						errors.push(`File "${file.name}" is too large. Max size is ${(maxSize / 1024 / 1024).toFixed(2)}MB.`);
					}
				});

				rejectedFiles.forEach((rejected) => {
					const file = rejected.file;
					if (
						currentSubscription &&
						file.size > (currentSubscription.totalDatasize * 1024 * 1024) - currentSubscription.dataSize
					) {
						errors.push(getDataLimitMessage(file));
					} else if (file.size > maxSize) {
						errors.push(`File "${file.name}" is too large. Max size is ${(maxSize / 1024 / 1024).toFixed(2)}MB.`);
					} else {
						errors.push(`File "${file.name}" could not be uploaded. It may be an unsupported format.`);
					}
				});

				if (errors.length > 0) {
					setError(errors[0]);
					if (onError) onError(errors[0]);
					return;
				}

				// If all files pass validation
				setFiles(acceptedFiles);
				setError(null);
				if (props.onDrop) {
					props.onDrop(acceptedFiles, rejectedFiles);
				}
			}
			else {
				setError('No Subscription Found!');
				if (onError) onError('No Subscription Found!');
				return;
			}
		},
		[maxSize, onError, props, currentSubscription]
	);

	const handleRemoveFiles = () => {
		setFiles([]);
		setError(null);
		setUploadProgress({});
		if (props.onDrop) {
			props.onDrop([], []);
		}
	};


	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		...props,
		onDrop: onDropHandler,
		maxSize,
		accept: Object.keys(acceptedFiles).length ? acceptedFiles : undefined,
	});
	React.useEffect(() => {
		if (defaultFiles) { setFiles(defaultFiles) }
	}, [defaultFiles])
	React.useEffect(() => { 
		if (progress && JSON.stringify(progress) !== JSON.stringify(uploadProgress)) {
			setUploadProgress(progress);
		} 
	}, [progress]);


	return (
		<Stack spacing={2}>
			{files.length > 0 ? (
				<UploadFileButtonWrapper
					sx={{
						border: `1px solid ${error ? "red" : "var(--mui-palette-divider)"}`,
						borderRadius: 1,
						p: 2,
					}}
					className="upload-file"
				>
					<Stack className="file-icon-wrapper" direction="row" spacing={2} alignItems="center">
						<Avatar
							sx={{
								bgcolor: "var(--mui-palette-background-paper)",
								color: error ? "red" : "var(--mui-palette-text-primary)",
							}}
						>
							<CloudArrowUpIcon />
						</Avatar>
						<Stack spacing={1} flex={1}>
							{files.map((file, index) => (
								<React.Fragment key={index}>
									<Stack direction="row" alignItems="center" spacing={1}>
										<Typography variant="body2">
											{file.name} ({(file.size / 1024).toFixed(2)} KB)
										</Typography>
										{uploadProgress[file.name] > 0 && uploadProgress[file.name] < 100 && (
											<Typography variant="caption" color="text.secondary">
												{Math.round(uploadProgress[file.name])}%
											</Typography>
										)}
										{uploadProgress[file.name] >= 100 && (
											<Avatar
												sx={{
													width: 20,
													height: 20,
													bgcolor: "success.main",
													color: "white",
													fontSize: 16,
												}}
											>
												&#10003;
											</Avatar>
										)}
									</Stack>
									{uploadProgress[file.name] > 0 && uploadProgress[file.name] < 100 && (
										<LinearProgress
											variant="determinate"
											value={uploadProgress[file.name] || 0}
											sx={{ height: 6, borderRadius: 1 }}
										/>
									)}
								</React.Fragment>
							))}

							{error && (
								<Typography color="error" variant="body2">
									{error}
								</Typography>
							)}
						</Stack>
						<IconButton onClick={handleRemoveFiles} size="small">
							<XIcon />
						</IconButton>
					</Stack>
				</UploadFileButtonWrapper>
			) : (
				<UploadFileButtonWrapper
					sx={{
						alignItems: "center",
						border: `1px dashed ${error || remainingSize <= 0 ? "red" : "var(--mui-palette-divider)"}`,
						borderRadius: 1,
						cursor: "pointer",
						display: "flex",
						justifyContent: "center",
						outline: "none",
						pointerEvents: remainingSize <= 0 ? "none" : "all",
						p: 6,
						...(isDragActive && { bgcolor: "var(--mui-palette-action-selected)", opacity: 0.5 }),
						"&:hover": { ...(!isDragActive && { bgcolor: "var(--mui-palette-action-hover)" }) },
					}}
					{...getRootProps()}
					className="upload-file"
				>
					<input {...getInputProps()} />
					<Stack direction="row" spacing={2} sx={{ alignItems: "center" }} className="file-icon-wrapper">
						<Avatar
							sx={{
								"--Avatar-size": "64px",
								"--Icon-fontSize": "var(--icon-fontSize-lg)",
								bgcolor: "var(--mui-palette-background-paper)",
								boxShadow: "var(--mui-shadows-8)",
								color: error || remainingSize <= 0 ? "red" : "var(--mui-palette-text-primary)",
							}}
						>
							<CloudArrowUpIcon fontSize="var(--Icon-fontSize)" />
						</Avatar>
						<Stack spacing={1}>
							<Typography
								variant="h6"
								color={error || remainingSize <= 0 ? "error" : "inherit"}
								className="upload-title"
							>
								<Typography component="span" sx={{ textDecoration: "underline" }} variant="inherit">
									Click to upload
								</Typography>{" "}
								or drag and drop
							</Typography>
							{caption && (
								<Typography color="text.secondary" variant="body2">
									{caption}
								</Typography>
							)}
							{error && (
								<Typography color="error" variant="body2">
									{error}
								</Typography>
							)}
							{remainingSize <= 0 && (
								<Typography className="storage-limit-error" color="error" variant="body2">
									You have reached your data storage capacity. Upgrade your plan to have your data storage limit
									increased.
								</Typography>
							)}
						</Stack>
					</Stack>
				</UploadFileButtonWrapper>
			)}
		</Stack>
	);
}
