"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { addInfoDataText, generateInfoDataText } from "@/utils/backend-endpoints";
import { getTextDataSize } from "@/utils/get-data-size";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Alert,
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
	OutlinedInput,
	Stack,
	Typography,
} from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

import { useAuth } from "@/components/auth/auth-context";
import { toast } from "@/components/core/toaster";
import SpeechToText from "@/components/common/SpeechToText";

const schema = zod.object({
	text: zod.string().min(50, "Your text must be at least 50 characters long.").optional().nullable(),
	isAIGenerated: zod.boolean().optional(),
});

const defaultValues = {
	text: "",
	isAIGenerated: false
};

const TextForm = ({ fetchData }: { fetchData: () => Promise<void> }) => {
	const { selectedBrand, user, currentSubscription, updateDataSize } = useAuth();
	const router = useRouter();
	const {
		control,
		handleSubmit,
		watch,
		getValues,
		setValue,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm({
		defaultValues,
		resolver: zodResolver(schema),
	});
	const [isPending, setIsPending] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false);
	const [isSpeechMode, setIsSpeechMode] = useState(false);
	const [showConfirmClose, setShowConfirmClose] = useState(false);

	const handleGenerate = async () => {
		const text = getValues("text"); // RHF API 
		clearErrors();
		if (!text.trim() || text.length <= 50) {
			setError("text", {
				message: "Your text must be at least 50 characters long.",
				type: "required"
			});
			return;
		}

		setIsGenerating(true);
		try {
			const response = await generateInfoDataText({ text });
			const { data, status } = response.data;

			if (status === 200) {
				setValue("text", data.enriched_main_info ?? '');
				setValue("isAIGenerated", true);
				toast.success("Text data generated!");
			}
		} catch (error) {
			console.error(error);
			toast.error("Something went wrong!");
		} finally {
			setIsGenerating(false);
		}
	};



	const onSubmit = useCallback(
		async (data: { text: string, isAIGenerated: boolean }) => {
			clearErrors();

			if (!user?.userId || !selectedBrand?._id || !data.text) {
				toast.error("Something went wrong!");
				return;
			}
			if (!data.text.trim() || data.text.length <= 50) {
				setError("text", {
					message: "Your text must be at least 50 characters long.",
					type: "required"
				});
				return;
			}
			setIsPending(true);
			try {
				const { data: response, status } = await addInfoDataText({
					userId: user.userId,
					brandId: selectedBrand._id,
					text: data.text,
					isAIGenerated: data.isAIGenerated,
				});
				if (status == 200) {
					toast.success("Text data added successfully!");
					setValue("text", "");
					fetchData();
					if (currentSubscription) {
						const size = getTextDataSize(data.text);
						updateDataSize(size);
					}
				}
				setIsPending(false);
			} catch (error) {
				setIsPending(false);
				console.error(error);
				toast.error("Something went wrong!");
			}
		},
		[selectedBrand, user, router, currentSubscription]
	);

	const handleSpeechToText = (text: string) => {
		const currentText = watch('text') || '';
		setValue('text', currentText ? currentText + ' ' + text : text);
	}

	return (
		<>
			<Card className="adddata-content"  >
				<form onSubmit={handleSubmit(onSubmit)}>
					<CardContent className="common-textarea ai-button">
						<Button
							variant="contained" className="ai-btn"
							sx={{ marginInlineStart: 'auto !important', marginBlockEnd: 1 }}
							onClick={handleGenerate}
							disabled={isGenerating || isSpeechMode || isPending || getValues('text').length < 50}
						>
							{isGenerating ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}<span>Rewrite with AI</span>
						</Button>
						<Controller
							control={control}
							name="text"
							render={({ field }) => (
								<FormControl error={Boolean(errors.text)} fullWidth>
									<OutlinedInput multiline rows={4} placeholder="Please enter minimum 50 characters..." {...field} />
									<Stack direction={'row'} justifyContent={'space-between'}>
										{errors.text && <FormHelperText error>{errors.text.message}</FormHelperText>}
										<FormHelperText sx={{ marginLeft: 'auto' }} error={getValues('text').length < 50}>{getValues('text').length ?? 0}</FormHelperText>

									</Stack>
								</FormControl>
							)}
						/>
						{errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
					</CardContent>
					<CardActions sx={{ justifyContent: "flex-end" }} className="add-data-cta">
						{
							watch('text') &&
							<Button
								sx={{ mr: 'auto' }}
								variant="outlined" color="primary"
								disabled={!watch('text') || isPending || isGenerating}
								onClick={() => setShowConfirmClose(true)}
							>
								Clear
							</Button>
						}
						<SpeechToText onModeChange={setIsSpeechMode} onChange={handleSpeechToText} disabled={isPending} />
						<Button
							type="submit"
							variant="contained"
							disabled={isPending || isGenerating || isSpeechMode || getValues('text').length < 50}
							startIcon={isPending && <CircularProgress size={20} color="inherit" />}
						>
							{isPending ? "Submitting..." : "Submit"}
						</Button>

					</CardActions>
				</form>
			</Card>
			<Dialog open={showConfirmClose} onClose={() => setShowConfirmClose(false)}>
				<DialogTitle sx={{ fontWeight: 'bold' }}>Are you sure?</DialogTitle>
				<DialogContent>
					<Typography>
						Are you sure you want to clear the text? This action cannot be undone.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button variant="outlined" onClick={() => setShowConfirmClose(false)}>
						Cancel
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={() => {
							setValue('text', '')
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

export default TextForm;
