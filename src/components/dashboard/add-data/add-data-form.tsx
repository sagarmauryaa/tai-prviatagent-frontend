"use client";

import * as React from "react";
import {
	Button,
	Card,
	CardContent,
	FormControl,
	FormHelperText,
	InputLabel,
	OutlinedInput,
	Select,
	Stack,
	styled,
	Typography,
} from "@mui/material";

import { useAuth } from "@/components/auth/auth-context";

import AddDataButton from "./add-data-form.style";
import CSVFileUploadForm from "./csv-file-form";
import FileUploadForm from "./file-upload-form";
import PDFUrlForm from "./pdfUrl-form";
import TextForm from "./text-form";
import WebPageForm from "./webpage-form";

const AddDataForm = ({ fetchData }: { fetchData: () => Promise<void> }) => {
	const [tab, setTab] = React.useState<"text" | "file_upload" | "web_url" | "pdf_url" | "csv_file">("text");
	const { currentSubscription } = useAuth();

	const remainingSize = currentSubscription
		? currentSubscription.totalDatasize * (1024 * 1024) - currentSubscription.dataSize
		: 0;

	return (
		<Card className="adddata-tab-wrapper">
			<CardContent>
				<Stack direction={"column"} spacing={2}>
					<AddDataButton direction="row" spacing={1} sx={{ mb: 2 }} className="add-btn-wrapper">
						<Button variant={tab === "text" ? "contained" : "outlined"} onClick={() => setTab("text")} fullWidth>
							Text
						</Button>
						<Button
							variant={tab === "file_upload" ? "contained" : "outlined"}
							onClick={() => setTab("file_upload")}
							fullWidth
						>
							File Upload
							{remainingSize <= 0 && <Typography className="exclamation-icon">!</Typography>}
						</Button>
						<Button variant={tab === "pdf_url" ? "contained" : "outlined"} onClick={() => setTab("pdf_url")} fullWidth>
							PDF URL
						</Button>
						<Button variant={tab === "web_url" ? "contained" : "outlined"} onClick={() => setTab("web_url")} fullWidth>
							Web Page URL
						</Button>
						{currentSubscription?.allowCsv && (
							<Button
								variant={tab === "csv_file" ? "contained" : "outlined"}
								onClick={() => setTab("csv_file")}
								fullWidth
							>
								CSV File
								{remainingSize <= 0 && <Typography className="exclamation-icon">!</Typography>}
							</Button>
						)}
					</AddDataButton>

					{(() => {
						switch (tab) {
							case "text": {
								return <TextForm fetchData={fetchData} />;
							}
							case "file_upload": {
								return <FileUploadForm fetchData={fetchData} />;
							}
							case "web_url": {
								return <WebPageForm fetchData={fetchData} />;
							}
							case "pdf_url": {
								return <PDFUrlForm fetchData={fetchData} />;
							}
							case "csv_file": {
								return  <CSVFileUploadForm /> ;
							}
							default: {
								return null;
							}
						}
					})()}
				</Stack>
			</CardContent>
		</Card>
	);
};

export default AddDataForm;
