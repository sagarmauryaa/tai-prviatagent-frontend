"use client";

import * as React from "react";
import Image from "next/image";
import RouterLink from "next/link";
import { deletInfoData, updateWebPageData } from "@/utils/backend-endpoints";
import { formatBytes } from "@/utils/formatBytes";
import { Close, EditCalendar, FileOpen, Link } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Button, Card, CardContent, CircularProgress, debounce, IconButton, Modal, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { maxWidth } from "@mui/system";
import { toast } from "sonner";

import { paths } from "@/paths";
import { useAuth } from "@/components/auth/auth-context";
import PaginatedDataTable from "@/components/core/paginated-data-table";

const MODAL_STYLE = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
};

interface InfoDataType {
	brandId: string;
	createdTime: number;
	isDeleted: boolean;
	merchantId: string;
	addedBy?: AddedByType;
	textMetaDataCount: number;
	fileMetaDataCount: number;
	dataSize?: number;
	sourceType?: string;
	webpageUrl?: string;
	text: string;
	updatedTime: number;
	_id: string;
}

type AddedByType = "Magento" | "Chrome Extension";
const addedByAssets: Record<AddedByType, string> = {
	"Magento": "magento-logo.png",
	"Chrome Extension": "new-image-for-ext.png"
}
const options: Intl.DateTimeFormatOptions = {
	year: "numeric",
	month: "short",
	day: "numeric",
	hour: "2-digit",
	minute: "2-digit",
	hour12: false,
};

const InfoDataTable = ({
	handleFetch,
	setLimit,
	limit,
	setPage,
	page,
	totalRecords = 0,
	setTotalRecords,
	dataRow,
	isLoading,
	setSearch,
}: {
	handleFetch: () => Promise<void>;
	setTotalRecords: (page: number) => void;
	totalRecords: number;
	setSearch: (val: string) => void;
	setPage: (page: number) => void;
	page: number;
	setLimit: (limit: number) => void;
	limit: number;
	dataRow: InfoDataType[];
	isLoading: boolean;
}) => {
	const { selectedBrand, updateDataSize } = useAuth();
	const [modalOpen, setModalOpen] = React.useState(false);
	const [selectedData, setSelectedData] = React.useState<InfoDataType | null>(null);
	const [readMoreModalOpen, setReadMoreModalOpen] = React.useState(false);
	const [readMoreLinkModalOpen, setReadMoreLinkModalOpen] = React.useState(false);
	const [isPending, setIsPending] = React.useState(false);
	const [isRefetching, setIsRefetching] = React.useState<string>("");

	const handleOpenDelete = (data: InfoDataType) => {
		setSelectedData(data);
		setModalOpen(true);
	};

	const handleDelete = async () => {
		if (!selectedData?._id || !selectedBrand?._id) return toast.error("Something went wrong!");
		setIsPending(true);
		try {
			const { status } = await deletInfoData({ infoId: selectedData._id, brandId: selectedBrand._id });
			if (status === 200) {
				toast.success("Text data deleted successfully!");
				handleFetch();
				setModalOpen(false);
				if (selectedData && selectedData.dataSize) {
					updateDataSize(selectedData.dataSize, false);
				}
			}
		} catch (error) {
			console.error(error);
			toast.error("Failed to delete data.");
		}
		setIsPending(false);
	};

	const handleRefetch = async (data: InfoDataType) => {
		if (!data.webpageUrl) return toast.error("Invalid URL!");
		setIsRefetching(data._id);
		try {
			const { status } = await updateWebPageData(data.brandId, data._id, data.webpageUrl);
			if (status === 200) {
				toast.success("Refetched latest data successfully!");
				handleFetch();
			}
		} catch (error) {
			console.error(error);
			toast.error("Failed to refetch data.");
		}
		setIsRefetching("");
	};
	const columns = [
		{
			field: "data",
			name: "Data",
			width: "400px",
			maxWidth: "400px",
			formatter: (row: InfoDataType) => (
				<div>
					<Box>
						<Typography
							className="table-title"
							sx={{
								display: "-webkit-box",
								WebkitLineClamp: 2,
								WebkitBoxOrient: "vertical",
								overflow: "hidden",
								mb: row.text && row.text.length > 100 ? 1 : 0,
							}}
						>
							{row.text}
						</Typography>
						<Box
							className="cta-wrapper"
							sx={{
								display: {
									xs: "flex",
									sm: "block",
									gap: "10px",
									alignItems: "center",
									paddingBottom: "10px",
									justifyContent: "space-between",
									paddingTop: "5px",
								},
							}}
						>
							{row.text && row.text.length > 30 && (
								<Button
									size="small"
									onClick={() => {
										setSelectedData(row);
										setReadMoreModalOpen(true);
									}}
								>
									Read More
								</Button>
							)}
							<>
								{row.sourceType === "webpage" &&
									<Stack
										direction="row"
										spacing={1}
										sx={{
											display: { marginInlineStart: "auto", xs: "flex", sm: "none", justifyContent: "space-between", alignItems: 'flex-end' },
										}}
										className="mobile-btns"
									>
										<Stack sx={{ position: "relative", }} className="btn-cstm">
											<Button
												variant="contained"
												href={paths.dashboard.infoTextMetaDataPreview(row._id)}
												component={RouterLink}
											>
												Text
											</Button>
											<Box
												sx={{
													position: "absolute",
													pointerEvents: "none",
													bgcolor: (theme) =>
														theme.palette.mode === "dark" ? "rgba(255, 255, 255 )" : "rgba(0, 0, 0)",
													color: (theme) => (theme.palette.mode === "dark" ? "#000" : "#fff"),
													borderRadius: "50%",
													right: -5,
													top: -5,
													width: "16px",
													height: "16px",
													display: "flex",
													alignItems: "center",
													fontWeight: 500,
													justifyContent: "center",
													fontSize: "0.75rem",
													zIndex: 1,
												}}
											>
												{row.textMetaDataCount || 0}
											</Box>
										</Stack> 
										{row.addedBy !== "Magento" &&
										<Stack sx={{ position: "relative" }} className="btn-cstm">
											<Button
												variant="contained"
												component={RouterLink}
												href={paths.dashboard.infoFileMetaDataPreview(row._id)}
											>
												File
											</Button>

											<Box
												sx={{
													position: "absolute",
													pointerEvents: "none",
													bgcolor: (theme) =>
														theme.palette.mode === "dark" ? "rgba(255, 255, 255 )" : "rgba(0, 0, 0)",
													color: (theme) => (theme.palette.mode === "dark" ? "#000" : "#fff"),
													borderRadius: "50%",
													right: -5,
													top: -5,
													width: "16px",
													height: "16px",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													fontSize: "0.75rem",
													fontWeight: 500,
													zIndex: 1,
												}}
											>
												{row.fileMetaDataCount || 0}
											</Box>
										</Stack>
										}
									</Stack>
									// : <Typography variant="body1">NA</Typography>
								}
							</>
						</Box>
					</Box>
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
							{
								row.webpageUrl &&
								<Stack direction={"row"} sx={{ width: "100%" }} alignItems={'flex-start'} justifyContent={'space-between'}
									borderBottom="1px solid var(--mui-palette-TableCell-border)">
									<Typography
										sx={{ display: { xs: "flex", sm: "none", justifyContent: "space-between", alignItems: "center" } }}
										textTransform="unset"
										variant="body2"
										lineHeight="180%"
										padding="10px 0"
									>
										Webpage Link :
									</Typography>
									<Stack gap={0} direction={'column'} sx={{ width: '50%' }}>
										<Typography
											variant="body2"
											sx={{
												display: '-webkit-box',
												WebkitLineClamp: 2,
												WebkitBoxOrient: 'vertical',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												wordBreak: 'break-all'
											}}
										>
											<a
												href={row.webpageUrl}
												target="_blank"
												rel="noopener noreferrer"
												style={{
													textDecoration: 'none',
													color: 'inherit',
													display: '-webkit-box',
													WebkitLineClamp: 2,
													WebkitBoxOrient: 'vertical',
													overflow: 'hidden',
													textOverflow: 'ellipsis',
													wordBreak: 'break-all'
												}}
											>
												{row.webpageUrl}
											</a>
											{row.webpageUrl.length > 40 && (
												<>
													<Button
														variant="text"
														sx={{ p: 0, minWidth: 'auto', ml: '2px' }}
														size="small"
														onClick={() => {
															setSelectedData(row);
															setReadMoreLinkModalOpen(true);
														}}
													>
														<Link />
													</Button>
												</>
											)}
										</Typography>
									</Stack>
								</Stack>
							}
							<Box
								className="added-via-wrapper"
								display="flex"
								width="100%"
								padding="10px 0"
								borderBottom="1px solid var(--mui-palette-TableCell-border)"
							>
								<Box
									padding="4px 0"
									sx={{
										display: {
											xs: "flex",
											sm: "none",
											justifyContent: "space-between",
											alignItems: "center",
											width: "52%",
											paddingRight: "8px",
										},
									}}
									textTransform="unset"
									lineHeight="180%"
								>
									<Typography variant="body2" display="block" lineHeight="100%">
										Data Size :
									</Typography>
									<Typography variant="body2" display="block" lineHeight="100%">
										{row.dataSize ? formatBytes(row.dataSize) : "-"}
									</Typography>
								</Box>
								<Box
									borderLeft="2px solid var(--mui-palette-TableCell-border)"
									padding="4px 0"
									sx={{
										display: {
											xs: "flex",
											sm: "none",
											justifyContent: "space-between",
											alignItems: "center",
											width: "48%",
											paddingLeft: "10px",
										},
									}}
									textTransform="unset"
									lineHeight="180%"
								>
									<Typography variant="body2" display="block" lineHeight="100%">
										Added Via:
									</Typography>
									<Typography variant="body2" display="block" lineHeight="100%">
										{row.addedBy ? (
											<Image
												alt="chome extenstion"
												width={30}
												height={30}
												className="chrome-icon"
												src={`/assets/${addedByAssets[row.addedBy]}`}
											/>
										) : (
											<Image
												alt="chome extenstion"
												width={25}
												height={25}
												className="chrome-icon"
												src="/assets/app.svg"
											/>

										)}
									</Typography>
								</Box>
							</Box>


							<Typography
								sx={{ display: { xs: "flex", sm: "none", justifyContent: "space-between", alignItems: "center" } }}
								textTransform="unset"
								variant="body2"
								lineHeight="180%"
								padding="10px 0"
								borderBottom="1px solid var(--mui-palette-TableCell-border)"
							>
								Added Date :
								<span >
									{new Date(row.createdTime).toLocaleString("en-US", options)}
								</span>
							</Typography>
							<Typography
								sx={{ display: { xs: "flex", sm: "none", justifyContent: "space-between", alignItems: "center" } }}
								textTransform="unset"
								variant="body2"
								lineHeight="180%"
								padding="10px 0"
								borderBottom="1px solid var(--mui-palette-TableCell-border)"
							>
								Updated Date:
								<span >
									{new Date(row.updatedTime).toLocaleString("en-US", options)}
								</span>
							</Typography>
						</Box>
						{
							row.addedBy !== 'Magento' &&
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
								{row.sourceType === "webpage" ? (
									<>
										{" "}
										<IconButton
											className="btn-cstm"
											title="Web URL"
											component={RouterLink}
											data-url={row.webpageUrl}
											target="_blank"
											href={row.webpageUrl ?? ""}
										>
											<OpenInNewIcon />
										</IconButton>
										<IconButton
											className="btn-cstm"
											disabled={isRefetching === row._id}
											onClick={() => handleRefetch(row)}
										>
											{isRefetching === row._id ? <CircularProgress size={24} /> : <RefreshIcon />}
										</IconButton>
									</>
								) : (
									""
								)}
								<IconButton className="btn-cstm" title="Delete Data" onClick={() => handleOpenDelete(row)}>
									<DeleteIcon />
								</IconButton>
								<IconButton
									className="btn-cstm"
									title="Edit Data"
									component={RouterLink}
									href={paths.dashboard.infoDataEditPreview(row._id)}
								>
									<ModeEditIcon />
								</IconButton>
							</Box>
						}
					</Box>
				</div>
			),
		},
		{
			name: "Web page Link",
			width: "800",
			formatter: (row: InfoDataType) => {
				return row.sourceType === "webpage" && row.webpageUrl ? (
					<>
						<Box>
							<Typography
								sx={{
									display: '-webkit-box',
									WebkitLineClamp: 2,
									WebkitBoxOrient: 'vertical',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									wordBreak: 'break-all'
								}}
							>
								<a
									href={row.webpageUrl}
									target="_blank"
									rel="noopener noreferrer"
									style={{
										textDecoration: 'none',
										color: 'inherit',
										display: '-webkit-box',
										WebkitLineClamp: 2,
										WebkitBoxOrient: 'vertical',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										wordBreak: 'break-all'
									}}
								>
									{row.webpageUrl}
								</a>
								{row.webpageUrl.length > 40 && (
									<>
										<Button
											variant="text"
											sx={{ p: 0, minWidth: 'auto', ml: '2px' }}
											size="small"
											onClick={() => {
												setSelectedData(row);
												setReadMoreLinkModalOpen(true);
											}}
										>
											<Link />
										</Button>
									</>
								)}
							</Typography>
						</Box>
					</>
				) : "-"
			}
		},
		{
			field: "dataSize",
			name: "Data Size",
			width: "100px",
			formatter: (row: InfoDataType) => (row.dataSize ? formatBytes(row.dataSize) : "-"),
		},
		{
			field: "addedBy",
			name: "Added Via",
			width: "120px",
			formatter: (row: InfoDataType) => row.addedBy ?? "App",
		},
		{
			field: "createdTime",
			name: "Added Date",
			width: "150px",
			formatter: (row: InfoDataType) => new Date(row.createdTime).toLocaleString("en-US", options),
		},
		{
			field: "updatedTime",
			name: "Updated Date",
			width: "150px",
			formatter: (row: InfoDataType) => <span>{new Date(row.updatedTime).toLocaleString("en-US", options)}</span>,
		},
		{
			width: "100px",
			formatter: (row: InfoDataType) => (
				<div className="action-col-btn">

					{
					
						// row && row.sourceType !== 'webpage' ?
						<Stack direction="column" spacing={1}>
							<Stack sx={{ position: "relative", maxWidth: "68px" }}>
								<Button
									variant="contained"
									href={paths.dashboard.infoTextMetaDataPreview(row._id)}
									component={RouterLink}
								>
									Text
								</Button>
								<Box
									sx={{
										position: "absolute",
										bgcolor: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255 )" : "rgba(0, 0, 0)"),
										color: (theme) => (theme.palette.mode === "dark" ? "#000" : "#fff"),
										borderRadius: "50%",
										right: -5,
										top: -5,
										width: "20px",
										height: "20px",
										display: "flex",
										alignItems: "center",
										fontWeight: 500,
										justifyContent: "center",
										fontSize: "0.75rem",
										zIndex: 1,
									}}
								>
									{row.textMetaDataCount || 0}
								</Box>
							</Stack>
							{row.addedBy !== "Magento" &&
							<Stack sx={{ position: "relative", maxWidth: "68px" }}>
								<Button
									variant="contained"
									component={RouterLink}
									href={paths.dashboard.infoFileMetaDataPreview(row._id)}
								>
									File
								</Button>

								<Box
									sx={{
										position: "absolute",
										bgcolor: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255 )" : "rgba(0, 0, 0)"),
										color: (theme) => (theme.palette.mode === "dark" ? "#000" : "#fff"),
										borderRadius: "50%",
										right: -5,
										top: -5,
										width: "20px",
										height: "20px",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										fontSize: "0.75rem",
										fontWeight: 500,
										zIndex: 1,
									}}
								>
									{row.fileMetaDataCount || 0}
								</Box>
							</Stack>
							}
						</Stack>
						// : <Typography variant="body1">NA</Typography>
					}
				</div>
			),
			name: "Meta Data",
		},
		{
			formatter: (row: InfoDataType) => (
				<div className="action-col-btn">
					<Stack direction="row" sx={{ justifyContent: "flex-start" }} className="action-col-btn">
						{row.sourceType === "webpage" && (<>
							<IconButton
								title="Web URL"
								component={RouterLink}
								data-url={row.webpageUrl}
								target="_blank"
								href={row.webpageUrl ?? ""}
							>
								<OpenInNewIcon />
							</IconButton>
							<IconButton disabled={isRefetching === row._id} onClick={() => handleRefetch(row)}>
								{isRefetching === row._id ? <CircularProgress size={24} /> : <RefreshIcon />}
							</IconButton>
						</>)}
						{row.addedBy !== 'Magento' && <>
							<IconButton title="Delete Data" onClick={() => handleOpenDelete(row)}>
								<DeleteIcon />
							</IconButton>
							<IconButton title="Edit Data" component={RouterLink} href={paths.dashboard.infoDataEditPreview(row._id)}>
								<ModeEditIcon />
							</IconButton>
						</>}
					</Stack>
				</div>
			),
			name: "Action",
			width: "150px",
		},
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

			<Modal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				aria-labelledby="delete-confirmation-modal"
				className="add-data-modal"
			>
				<Box sx={MODAL_STYLE} className="add-data-modal-content">
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
			<Modal
				open={readMoreModalOpen}
				onClose={() => setReadMoreModalOpen(false)}
				aria-labelledby="read-more-modal"
				className="add-data-modal"
			>
				<Box sx={MODAL_STYLE} className="add-data-modal-content">
					<Card sx={{ maxWidth: 900, padding: 0 }}>
						<IconButton
							onClick={() => setReadMoreModalOpen(false)}
							sx={{
								position: "sticky",
								top: 8,
								right: 8,
								float: "right",
								zIndex: 1,
								bgcolor: "background.paper",
								"&:hover": {
									bgcolor: "action.hover",
								},
							}}
							className="modal-close"
						>
							<Close />
						</IconButton>
						<CardContent sx={{ width: "100%", maxHeight: "80vh", overflow: "auto", position: "relative" }}>
							<Typography variant="body1">{selectedData?.text}</Typography>
						</CardContent>
					</Card>
				</Box>
			</Modal>
			<Modal
				open={readMoreLinkModalOpen}
				onClose={() => setReadMoreLinkModalOpen(false)}
				aria-labelledby="read-more-modal"
				className="add-data-modal"
			>
				<Box sx={MODAL_STYLE} className="add-data-modal-content">
					<Card sx={{ maxWidth: 900, padding: 0 }}>
						<IconButton
							onClick={() => setReadMoreLinkModalOpen(false)}
							sx={{
								position: "sticky",
								top: 8,
								right: 8,
								float: "right",
								zIndex: 1,
								bgcolor: "background.paper",
								"&:hover": {
									bgcolor: "action.hover",
								},
							}}
							className="modal-close"
						>
							<Close />
						</IconButton>
						<CardContent sx={{ width: "100%", maxHeight: "80vh", overflow: "auto", position: "relative" }}>
							<Typography variant="body1">
								<a href={selectedData?.webpageUrl} style={{
									textOverflow: 'ellipsis',
									wordBreak: 'break-all'
								}} target="_blank" rel="noopener noreferrer">{selectedData?.webpageUrl}</a></Typography>
						</CardContent>
					</Card>
				</Box>
			</Modal>
		</React.Fragment>
	);
};

export default InfoDataTable;
