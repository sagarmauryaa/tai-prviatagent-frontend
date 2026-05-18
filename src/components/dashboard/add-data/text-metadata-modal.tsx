"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { getTextMetaData } from "@/utils/backend-endpoints";
import { Button, Card } from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { X as XIcon } from "@phosphor-icons/react/dist/ssr/X";
import { toast } from "sonner";

import { paths } from "@/paths";
import { useAuth } from "@/components/auth/auth-context";

import MetaDataDialog from "./metadata-modal.style";
import TextMetadataForm from "./text-metadata-form";
import TextMetaDataTable from "./text-metadata-table";

interface InfoDataType {
	_id: string;
	brandId: string;
	name: string;
	value: string;
	description: string; isAIGenerated: boolean;
	type: string;
	createdTime: number;
	updatedTime: number;
}

export function TextMetaDataModal({ infoId, fetchInfoData }: { infoId: string; fetchInfoData: () => Promise<void> }) {
	const { selectedBrand } = useAuth();
	const router = useRouter();
	const [dataRow, setDataRow] = React.useState<InfoDataType[]>([]);
	const [page, setPage] = React.useState(0);
	const [totalRecords, setTotalRecords] = React.useState(0);
	const [limit, setLimit] = React.useState(10);
	const [isEditable, setIsEditable] = React.useState(true);

	const [isLoading, setIsLoading] = React.useState(true);
	const [modalOpen, setModalOpen] = React.useState(false);
	const [search, setSearch] = React.useState("");

	const handleClose = React.useCallback(() => {
		router.push(paths.dashboard.addData);
	}, [router]);

	const fetchData = React.useCallback(async () => {
		if (!selectedBrand?._id) return;
		setIsLoading(true);
		try {
			const { data, status } = await getTextMetaData(infoId, selectedBrand._id, "text", page + 1, limit, search);
			if (status === 200) {
				console.log('data?.data', data?.data);
				
				setIsLoading(false);
				setIsEditable(data?.data?.isEditiable ?? true);
				setDataRow(data?.data?.data || []);
				setTotalRecords(data?.data.pagination?.totalRecords ?? 0);
			}
		} catch (error) {
			setIsLoading(false);
			toast.error("Failed to fetch data.");
		}
	}, [selectedBrand, page, infoId, router, limit, search]);

	React.useEffect(() => {
		if (Boolean(infoId)) {
			fetchData();
		}
	}, [fetchData, infoId, router]);

	return (
		<React.Fragment>
			<MetaDataDialog
				maxWidth={"xl"}
				onClose={handleClose}
				open={Boolean(infoId)}
				className="metadata-modal"
				sx={{
					"& .MuiDialog-paper": { height: "100%", width: "100%" },
				}}
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
								Text Metadata
							</Typography>
							{
								isEditable &&
								<Button variant="contained" onClick={() => setModalOpen(true)}>
									Add MetaData
								</Button>
							}
						</Stack>
						<Card className="maetadata-table data-table text-table-meta">
							<TextMetaDataTable
								fetchInfoData={fetchInfoData}
								setSearch={setSearch}
								setLimit={setLimit}
								limit={limit}
								infoId={infoId}
								page={page}
								isEditable={isEditable}
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
			<TextMetadataForm
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
