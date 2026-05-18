"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button, Card, CardContent, CircularProgress, debounce, IconButton, Modal, Stack } from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from "sonner";

import { deleteBrandInstance } from "@/utils/backend-endpoints";
import PaginatedDataTable from "@/components/core/paginated-data-table";
import { useAuth } from "@/components/auth/auth-context";
import RouterLink from "next/link";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { BRAND_PAGE_URL, REACT_APP_BASE_URL } from "@/utils/config";
import ShareInstanceModal from "@/components/core/share-instance-modal";
import { QrCode, Share } from "@mui/icons-material";
import QRModal from "@/components/core/qr-modal";
const MODAL_STYLE = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
};
interface InfoDataType {
    _id: string;
    name: string;
    tellofyBrandUrl: string;
    createdTime: string;
    modifiedTime: string;
    chatbotVisibility?: string;
}

const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
};

const InstanceDataTable = ({ handleFetch, setPage, page, setLimit, limit, totalRecords = 0, setTotalRecords, dataRow, isLoading, setSearch, selectedData, setSelectedData, handleEditModal }: { handleFetch: () => Promise<void>, setTotalRecords: (page: number) => void, setSearch: (val: string) => void, totalRecords: number, setPage: (page: number) => void, selectedData: InfoDataType | null, setSelectedData: (data: InfoDataType) => void, page: number, setLimit: (limit: number) => void, limit: number, dataRow: InfoDataType[], isLoading: boolean, handleEditModal: (stat: boolean) => void }) => {
    const { getBrands, setLoading } = useAuth()
    const [modalOpen, setModalOpen] = React.useState(false);
    const [isPending, setIsPending] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [openQr, setOpenQr] = React.useState(false);

    const handleOpenDelete = (data: InfoDataType) => {
        setSelectedData(data);
        setModalOpen(true);
    };
    const handleOpenEditModal = (data: InfoDataType) => {
        setSelectedData(data);
        handleEditModal(true);
    };
    const handleOpenShareModal = (data: InfoDataType) => {
        setSelectedData(data);
        setOpen(true);
    };
    const handleOpenQrModal = (data: InfoDataType) => {
        setSelectedData(data);
        setOpenQr(true);
    };

    const handleDelete = async () => {
        if (!selectedData?._id) return toast.error("Something went wrong!");
        setIsPending(true);
        try {
            const { status } = await deleteBrandInstance(selectedData?._id);
            if (status === 200) {
                toast.success("Brand Instance deleted successfully!");
                handleFetch();
                setModalOpen(false);
                getBrands()
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete data.");
        }
        setIsPending(false);
    };
    function encodeId(id: string): string {
        const base64 = Buffer.from(id.toString()).toString('base64');
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }


    const columns = [
        {
            field: "name", name: "Name", formatter: (row: InfoDataType) => (
                <div className="table-data-wrapper">
                    <Typography className="table-title" variant="body2">{row.name}</Typography>
                    <Box className="additional-wrapper" sx={{ display: { xs: "flex", sm: "none" }, flexFlow: "column", alignItems: "flex-start" }}>
                        <Box className="additional-data-wrapper" width="100%" sx={{ display: "flex", flexFlow: "column" }}>
                            <Typography
                                sx={{ display: { xs: "flex", sm: "none" }, justifyContent: "space-between", alignItems: "center" }}
                                textTransform="unset"
                                variant="body2"
                                lineHeight="180%"
                                padding="10px 0"
                                borderBottom="1px solid var(--mui-palette-TableCell-border)"
                                borderTop="1px solid var(--mui-palette-TableCell-border)"
                                marginTop="10px"
                            >
                                Added Date:
                                <span
                                >
                                    {new Date(row.createdTime).toLocaleString("en-US", options)}
                                </span>
                            </Typography>

                            <Typography
                                sx={{ display: { xs: "flex", sm: "none" }, justifyContent: "space-between", alignItems: "center" }}
                                textTransform="unset"
                                variant="body2"
                                lineHeight="180%"
                                padding="10px 0"
                                borderBottom="1px solid var(--mui-palette-TableCell-border)"
                            >
                                Updated Date:
                                <span
                                >
                                    {new Date(row.modifiedTime).toLocaleString("en-US", options)}
                                </span>
                            </Typography>
                        </Box>

                        <Box className="action-cta" width="100%" paddingTop="10px">
                            <Typography
                                sx={{ display: { xs: "block", sm: "none" } }}
                                textTransform="unset"
                                variant="body2"
                                component="div"  // ✅ Safer as block element
                                lineHeight="180%"
                                marginRight="auto"
                            >
                                Actions:
                            </Typography>
                            {dataRow.length > 1 && (
                                <IconButton className="btn-cstm" onClick={() => handleOpenDelete(row)}>
                                    <DeleteIcon />
                                </IconButton>
                            )}
                            <IconButton className="btn-cstm" onClick={() => handleOpenEditModal(row)}>
                                <ModeEditIcon />
                            </IconButton>
                            <IconButton className="btn-cstm" onClick={() => handleOpenShareModal(row)}
                            >
                                <Share />
                            </IconButton >
                            <IconButton className="btn-cstm" onClick={() => handleOpenQrModal(row)}
                            >
                                <QrCode />
                            </IconButton >
                        </Box>
                    </Box>
                </div>
            )
        },
        {
            field: "createdTime", name: "Added Date", width: '200px',
            formatter: (row: InfoDataType) => new Date(row.createdTime).toLocaleString("en-US", options)
        },
        {
            field: "modifiedTime", name: "Updated Date", width: '200px', formatter: (row: InfoDataType) => new Date(row.modifiedTime).toLocaleString("en-US", options),
        },
        {
            formatter: (row: InfoDataType) => (
                <Stack direction="row" spacing={1} >
                    {
                        dataRow.length > 1 &&
                        <IconButton
                            onClick={() => handleOpenDelete(row)}
                        >
                            <DeleteIcon />
                        </IconButton >
                    }
                    <IconButton onClick={() => handleOpenEditModal(row)}
                    >
                        <ModeEditIcon />
                    </IconButton >
                    <IconButton onClick={() => handleOpenShareModal(row)}
                    >
                        <Share />
                    </IconButton >
                    <IconButton  onClick={() => handleOpenQrModal(row)}
                    >
                        <QrCode />
                    </IconButton >
                </Stack>
            ), name: "Actions", width: "200px"
        },
    ];

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        debounce(() => {
            setSearch(event.target.value);
        }, 2000)()
    }
    return (
        <React.Fragment>
            <PaginatedDataTable handleSearch={handleSearch} limit={limit} setLimit={setLimit} isLoading={isLoading} columns={columns} setPage={setPage} dataRow={dataRow} totalRecords={totalRecords} page={page} />
            {
                selectedData && open &&
                <ShareInstanceModal open={open} setOpen={setOpen} link={`${REACT_APP_BASE_URL}/try-it-now/${encodeId(selectedData?._id)}`} />
            }
            {
                selectedData && openQr &&
                <QRModal open={openQr} setOpen={setOpenQr} link={`${REACT_APP_BASE_URL}/try-it-now/${encodeId(selectedData?._id)}`} />
            }
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="delete-confirmation-modal"
            >
                <Box sx={MODAL_STYLE}>
                    <Card sx={{ width: "100%" }}>
                        <CardContent>
                            <Typography variant="h6" component="h2">
                                ⚠️ Confirm Deletion
                            </Typography>
                            <Typography sx={{ mt: 2 }}>
                                Deleting this instance will permanently remove all associated data. This action cannot be undone. Are you sure you want to proceed?
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
                                <Button variant="text" onClick={() => setModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button disabled={isPending} startIcon={isPending && <CircularProgress size={20} color="inherit" />} variant="contained" onClick={handleDelete}>
                                    {isPending ? 'Deleting...' : 'Delete'}
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Box>
            </Modal>
        </React.Fragment>
    )
}

export default InstanceDataTable