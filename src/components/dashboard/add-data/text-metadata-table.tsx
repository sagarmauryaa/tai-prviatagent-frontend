"use client";

import * as React from "react";
import { deleteTextMetaData } from "@/utils/backend-endpoints";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { Button, Card, CardContent, CircularProgress, debounce, IconButton, Modal, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { toast } from "sonner";

import PaginatedDataTable from "@/components/core/paginated-data-table";

import TextMetadataForm from "./text-metadata-form";

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
	value: string;
	description: string;
	isAIGenerated: boolean;
	type: string;
	addedBy?: string;
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

const TextMetaDataTable = ({
	infoId,
	handleFetch,
	setLimit,
	limit,
	setPage,
	page,
	isEditable = true,
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
	isEditable?: boolean;
	page: number;
	setLimit: (limit: number) => void;
	limit: number;
	dataRow: InfoDataType[];
	isLoading: boolean;
	fetchInfoData: () => Promise<void>;
}) => {
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
			const { status } = await deleteTextMetaData(selectedData?._id);
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
		// {
		// 	field: "_id",
		// 	name: "ID",
		// 	width: "200px",
		// 	formatter: (row: InfoDataType) => (
		// 		<>
		// 			<Typography variant="body2">{row._id}</Typography>
		// 		</>
		// 	),
		// },
		{
			field: "name", name: "Name", width: "200px", formatter: (row: InfoDataType) => (
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
						<Box className="additional-data-wrapper" width="100%" sx={{ display: 'flex', flexFlow: 'column' }}>
							<Typography
								sx={{ display: { xs: "flex", sm: "none", justifyContent: "space-between", alignItems: "center" } }}
								textTransform="unset"
								variant="body2"
								lineHeight="180%"
								padding="0 0 10px"
								borderBottom="1px solid var(--mui-palette-TableCell-border)"
								marginTop="10px"
								width="100%"
							>
								Name:<Typography variant="body2" maxWidth="59%" width="100%" textAlign="left">{row.name}</Typography>
							</Typography>
							<Typography
								sx={{ display: { xs: "flex", sm: "none", justifyContent: "space-between", alignItems: "center" } }}
								textTransform="unset"
								variant="body2"
								lineHeight="180%"
								padding="10px 0"
								borderBottom="1px solid var(--mui-palette-TableCell-border)"
								width="100%"
							>
								Value:
								<Typography variant="body2" maxWidth="59%" width="100%" textAlign="left" sx={{ wordBreak: "break-all" }}>
									{row.value}
								</Typography>
							</Typography>
							<Typography
								sx={{ display: { xs: "flex", sm: "none", justifyContent: "space-between", alignItems: "center" } }}
								textTransform="unset"
								variant="body2"
								lineHeight="180%"
								padding="10px 0"
								borderBottom="1px solid var(--mui-palette-TableCell-border)"
								width="100%"
							>
								Description:
								<Typography variant="body2" maxWidth="59%" width="100%" textAlign="left" sx={{ wordBreak: "break-word" }}>
									{row.description}
								</Typography>
							</Typography>
							<Typography
								sx={{ display: { xs: "flex", sm: "none", justifyContent: "space-between", alignItems: "center" } }}
								textTransform="unset"
								variant="body2"
								lineHeight="180%"
								padding="10px 0"
								borderBottom="1px solid var(--mui-palette-TableCell-border)"
								width="100%"
							>
								Added Date:
								<Typography variant="body2" maxWidth="80%" sx={{ wordBreak: "break-all" }}>
									{new Date(row.createdTime).toLocaleString("en-US", options)}
								</Typography>
							</Typography>
							<Typography
								sx={{ display: { xs: "flex", sm: "none", justifyContent: "space-between", alignItems: "center" } }}
								textTransform="unset"
								variant="body2"
								lineHeight="180%"
								padding="10px 0"
								borderBottom="1px solid var(--mui-palette-TableCell-border)"
								width="100%"
							>
								Updated Date:
								<Typography variant="body2"  >
									{new Date(row.updatedTime).toLocaleString("en-US", options)}
								</Typography>
							</Typography>
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
		{ field: "value", name: "Value" },
		{
			field: "description",
			name: "Description",
			width: "250px",
			formatter: (row: InfoDataType) => (
				<Box>
					<Typography
						sx={{
							display: "-webkit-box",
							WebkitLineClamp: 2,
							WebkitBoxOrient: "vertical",
							overflow: "hidden",
							mb: row.description && row.description.length > 100 ? 1 : 0,
						}}
					>
						{row.description}
					</Typography>{" "}
				</Box>
			),
		},
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

			<TextMetadataForm
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

export default TextMetaDataTable;
