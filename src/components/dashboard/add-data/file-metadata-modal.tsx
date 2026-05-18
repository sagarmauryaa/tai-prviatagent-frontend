"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { getFileMetaData } from "@/utils/backend-endpoints";
import { Box, Button, Card } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { X as XIcon } from "@phosphor-icons/react/dist/ssr/X";
import { toast } from "sonner";

import { paths } from "@/paths";
import { useAuth } from "@/components/auth/auth-context";

import FileMetadataForm from "./file-metadata-form-multiple";
import FileMetaDataTable from "./file-metadata-table";
import MetaDataDialog from "./metadata-modal.style";

interface InfoDataType {
	_id: string;
	brandId: string;
	name: string;
	description: string;
	type: "video" | "pdf" | "image" | undefined;
	isAIGenerated: boolean;
	publicUrl: string;
	S3Url: string;
	createdTime: number;
	updatedTime: number;
}

export function FileMetaDataModal({ infoId,  fetchInfoData }: { infoId: string; fetchInfoData: () => Promise<void> }) {
	const { selectedBrand } = useAuth();
	const router = useRouter();
	const [dataRow, setDataRow] = React.useState<InfoDataType[]>([]);
	const [page, setPage] = React.useState(0);
	const [isEditable, setIsEditable] = React.useState(true);
	const [limit, setLimit] = React.useState(10);

	const [totalRecords, setTotalRecords] = React.useState(0);
	const [isLoading, setIsLoading] = React.useState(true);
	const [search, setSearch] = React.useState("");
	const [modalOpen, setModalOpen] = React.useState(false);

	const handleClose = React.useCallback(() => {
		router.push(paths.dashboard.addData);
	}, [router]);

	const fetchData = React.useCallback(async () => {
		if (!selectedBrand?._id) return;
		setIsLoading(true);
		try {
			const { data, status } = await getFileMetaData(infoId, selectedBrand._id, "file", page + 1, limit, search);
			if (status === 200) {
				setIsLoading(false);
				setIsEditable(data?.data?.isEditiable ?? true);
				setDataRow(data?.data?.data || []);
				setTotalRecords(data?.data.pagination?.totalRecords ?? 0);
			}
		} catch (error) {
			setIsLoading(false);
			console.error("Error fetching data:", error);
			toast.error("Failed to fetch data.");
		}
	}, [selectedBrand, page, infoId, limit, search]);

	React.useEffect(() => {
		if (Boolean(infoId)) {
			fetchData();
		}
	}, [fetchData, infoId, router]);
	return (
		<React.Fragment>
			<MetaDataDialog
				maxWidth="xl"
				onClose={handleClose}
				open={Boolean(infoId)}
				sx={{
					"& .MuiDialog-paper": { height: "100%", width: "100%" },
				}}
				className="metadata-modal"
			>
				<DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minHeight: 0 }}>
					<Stack
						direction="row"
						sx={{ alignItems: "center", flex: "0 0 auto", justifyContent: "space-between" }}
						className="modal-header"
					>
						<Typography variant="h6" className="meta-data-id">
							Info Id : {infoId}
						</Typography>
						<IconButton onClick={handleClose} className="modal-close">
							<XIcon />
						</IconButton>
					</Stack>
					<Stack spacing={3} sx={{ flex: "1 1 auto" }} className="modal-content">
						<Stack
							spacing={3}
							direction={{ md: "row", sm: "column" }}
							sx={{ justifyContent: "space-between", alignItems: "center" }}
							className="metadata-title-wrapper"
						>
							<Typography variant="h4" className="metadata-title">
								File Metadata
							</Typography>
							{
								isEditable &&
								<Button variant="contained" onClick={() => setModalOpen(true)}>
									Add MetaData
								</Button>
							}
						</Stack>
						<Card className="maetadata-table data-table">
							<FileMetaDataTable
								fetchInfoData={fetchInfoData}
								setSearch={setSearch}
								limit={limit}
								setLimit={setLimit}
								infoId={infoId}
								isEditable={isEditable}
								page={page}
								setPage={setPage}
								totalRecords={totalRecords}
								setTotalRecords={setTotalRecords}
								handleFetch={fetchData}
								dataRow={dataRow}
								isLoading={isLoading}
							/>
						</Card>
					</Stack>
				</DialogContent>
			</MetaDataDialog>
			<FileMetadataForm
				handleFetch={async () => {
					await fetchData();
					await fetchInfoData();
				}}
				infoId={infoId}
				open={modalOpen}
				handleModal={(status: boolean) => setModalOpen(status)}
			/>
		</React.Fragment>
	);
}
