"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { deleteFileMetaData, getFileMetaData } from "@/utils/backend-endpoints";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { Button, Card, CardContent, CircularProgress, debounce, IconButton, Modal, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { toast } from "sonner";

import { useAuth } from "@/components/auth/auth-context";
import PaginatedDataTable from "@/components/core/paginated-data-table";

import FileMetadataForm from "./file-metadata-form-multiple";

const MODAL_STYLE = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
};
interface InfoDataType {
	_id: string;
	brandId: string;
	name: string;
	description: string;
	type: "video" | "pdf" | "image" | undefined;
	publicUrl: string;
	S3Url: string;
	addedBy?: string;
	isAIGenerated: boolean;
	createdTime: number;
	updatedTime: number;
}

const options: Intl.DateTimeFormatOptions = {
	year: "numeric",
	month: "short",
	day: "numeric",
	hour: "2-digit",
	minute: "2-digit",
	hour12: false,
};

const FileMetaDataTable = ({
	infoId,
	handleFetch,
	setLimit,
	limit,
	setPage,
	isEditable = true,
	page,
	totalRecords = 0,
	setTotalRecords,
	dataRow,
	isLoading,
	setSearch,
	fetchInfoData,
}: {
	infoId: string;
	handleFetch: () => Promise<void>;
	setTotalRecords: (page: number) => void;
	setSearch: (val: string) => void;
	totalRecords: number;
	setPage: (page: number) => void;
	page: number;
	setLimit: (limit: number) => void;
	limit: number;
	isEditable?: boolean;
	dataRow: InfoDataType[];
	isLoading: boolean;
	fetchInfoData: () => Promise<void>;
}) => {
	const { selectedBrand } = useAuth();
	const router = useRouter();
	const [modalOpen, setModalOpen] = React.useState(false);
	const [editModalOpen, setEditModalOpen] = React.useState(false);
	const [selectedData, setSelectedData] = React.useState<InfoDataType | null>(null);
	const [isPending, setIsPending] = React.useState(false);

	const handleOpenDelete = (data: InfoDataType) => {
		setSelectedData(data);
		setModalOpen(true);
	};
	const handleOpenEditModal = (data: InfoDataType) => {
		setSelectedData(data);
		setEditModalOpen(true);
	};

	const handleDelete = async () => {
		if (!selectedData?._id) return toast.error("Something went wrong!");
		setIsPending(true);
		try {
			const { status } = await deleteFileMetaData(selectedData?._id);
			if (status === 200) {
				toast.success("Text data deleted successfully!");
				handleFetch();
				fetchInfoData();
				setModalOpen(false);
			}
		} catch (error) {
			console.error(error);
			toast.error("Failed to delete data.");
		}
		setIsPending(false);
	};

	const columns = [
		{
			field: "name", name: "Name", width: "120px", formatter: (row: InfoDataType) => (
				<div>
					<Typography className="table-title" variant="body2">{row.name}</Typography>
					<Box
						className="additional-wrapper"
						sx={{
							display: {
								xs: "flex",
								sm: "none",
								justifyContent: "flex-start",
								flexFlow: "column",
								alignItems: "flex-start",
							},
						}}
					>
						<Box className="additional-data-wrapper" width="100%" sx={{ display: "flex", flexFlow: "column" }}>
							<Box
								sx={{ display: { xs: "flex", sm: "none", justifyContent: "space-between", alignItems: "center" } }}
								textTransform="unset"
								lineHeight="180%"
								padding="10px 0"
								borderBottom="1px solid var(--mui-palette-TableCell-border)"
								marginTop="10px"
								width="100%"
							>
								Type:
								<Typography variant="body2" maxWidth="59%" width="100%" textAlign="left">
									{row.type}
								</Typography>
							</Box>
							<Box
								sx={{ display: { xs: "flex", sm: "none", justifyContent: "space-between", alignItems: "center" } }}
								textTransform="unset"
								lineHeight="180%"
								padding="10px 0"
								borderBottom="1px solid var(--mui-palette-TableCell-border)"
								width="100%"
							>
								Name:
								<Typography variant="body2" width="100%" maxWidth="59%" textAlign="left" sx={{ wordBreak: "break-all" }}>
									{row.name}
								</Typography>
							</Box>
							<Box
								sx={{ display: { xs: "flex", sm: "none", justifyContent: "space-between", alignItems: "center" } }}
								textTransform="unset"
								lineHeight="180%"
								padding="10px 0"
								borderBottom="1px solid var(--mui-palette-TableCell-border)"
								width="100%"
							>
								S3 URL:
								<Typography variant="body2" width="100%" maxWidth="59%" textAlign="left" sx={{ wordBreak: "break-word" }}>
									<a href={row.publicUrl} target="_blank">
										View
									</a>
								</Typography>
							</Box>
							<Box
								sx={{ display: { xs: "flex", sm: "none", justifyContent: "space-between", alignItems: "center" } }}
								textTransform="unset"
								lineHeight="180%"
								padding="10px 0"
								borderBottom="1px solid var(--mui-palette-TableCell-border)"
								width="100%"
							>
								Description:
								<Typography variant="body2" width="100%" maxWidth="59%" textAlign="left" sx={{ wordBreak: "break-word" }}>
									{row.description}
								</Typography>
							</Box>
							<Box
								sx={{ display: { xs: "flex", sm: "none", justifyContent: "space-between", alignItems: "center" } }}
								textTransform="unset"
								lineHeight="180%"
								padding="10px 0"
								borderBottom="1px solid var(--mui-palette-TableCell-border)"
								width="100%"
							>
								Added Date:
								<Typography variant="body2" maxWidth="80%" sx={{ wordBreak: "break-all" }}>
									{new Date(row.createdTime).toLocaleString("en-US", options)}
								</Typography>
							</Box>
							<Box
								sx={{ display: { xs: "flex", sm: "none", justifyContent: "space-between", alignItems: "center" } }}
								textTransform="unset"
								lineHeight="180%"
								padding="10px 0"
								borderBottom="1px solid var(--mui-palette-TableCell-border)"
								width="100%"
							>
								Updated Date:
								<Typography variant="body2">{new Date(row.updatedTime).toLocaleString("en-US", options)}</Typography>
							</Box>
						</Box>
						{
							((!row.addedBy || row?.addedBy !== 'Magento') && isEditable) &&
							<Box className="action-cta" width="100%" paddingTop="10px">
								<Typography
									sx={{ display: { xs: "block", sm: "none" } }}
									textTransform="unset"
									variant="body2"
									lineHeight="180%"
									marginRight="auto"
								>
									Actions:
								</Typography>

								<IconButton className="btn-cstm" onClick={() => handleOpenDelete(row)}>
									<DeleteIcon />
								</IconButton>
								<IconButton className="btn-cstm" onClick={() => handleOpenEditModal(row)}>
									<ModeEditIcon />
								</IconButton>
							</Box>
						}
					</Box>
				</div>
			),
		},
		{ field: "type", name: "Type" },
		{
			name: "S3 URL",
			width: "100px",
			formatter: (row: InfoDataType) => (
				<a href={row.publicUrl} target="_blank">
					View
				</a>
			),
		},
		{ field: "description", name: "Description", width: "200px" },
		{
			field: "createdTime",
			name: "Added Date",
			width: "180px",
			formatter: (row: InfoDataType) => new Date(row.createdTime).toLocaleString("en-US", options),
		},
		{
			field: "updatedTime",
			name: "Updated Date",
			width: "180px",
			formatter: (row: InfoDataType) => new Date(row.updatedTime).toLocaleString("en-US", options),
		},
		{
			name: "Action",
			formatter: (row: InfoDataType) => {
				const shouldShowActions =
					((!row.addedBy || row.addedBy !== "Magento") && isEditable);

				return shouldShowActions ? (
					<Stack direction="row" spacing={1}>
						<IconButton onClick={() => handleOpenDelete(row)}>
							<DeleteIcon />
						</IconButton>
						<IconButton onClick={() => handleOpenEditModal(row)}>
							<ModeEditIcon />
						</IconButton>
					</Stack>
				) : null;
			},
		}
	];
	const handleSearch = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		debounce(() => {
			setSearch(event.target.value);
		}, 2000)();
	};
	return (
		<React.Fragment>
			<PaginatedDataTable
				handleSearch={handleSearch}
				setLimit={setLimit}
				limit={limit}
				isLoading={isLoading}
				columns={columns}
				setPage={setPage}
				dataRow={dataRow}
				totalRecords={totalRecords}
				page={page}
			/>
			<Modal open={modalOpen} onClose={() => setModalOpen(false)} aria-labelledby="delete-confirmation-modal">
				<Box sx={MODAL_STYLE}>
					<Card sx={{ width: "100%" }}>
						<CardContent>
							<Typography variant="h6" component="h2">
								Are you sure?
							</Typography>
							<Typography sx={{ mt: 2 }}>
								This information will be deleted. Are you sure this action cannot be undone.
							</Typography>
							<Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: "flex-end" }}>
								<Button variant="text" onClick={() => setModalOpen(false)}>
									Cancel
								</Button>
								<Button
									disabled={isPending}
									startIcon={isPending && <CircularProgress size={20} color="inherit" />}
									variant="contained"
									onClick={handleDelete}
								>
									{isPending ? "Deleting..." : "Delete"}
								</Button>
							</Stack>
						</CardContent>
					</Card>
				</Box>
			</Modal>

			<FileMetadataForm
				handleFetch={async () => {
					await handleFetch();
					await fetchInfoData();
				}}
				infoId={infoId}
				data={selectedData}
				open={editModalOpen}
				handleModal={(status) => setEditModalOpen(status)}
			/>
		</React.Fragment>
	);
};

export default FileMetaDataTable;
