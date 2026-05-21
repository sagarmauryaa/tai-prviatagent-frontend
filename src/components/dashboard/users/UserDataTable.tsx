"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Badge, Button, Card, CardContent, CircularProgress, debounce, IconButton, Modal, Stack } from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from "sonner";
import RouterLink from "next/link";
import { paths } from "@/paths";

import PaginatedDataTable from "@/components/core/paginated-data-table";
import { REACT_APP_BASE_URL } from "@/utils/config";
import ShareInstanceModal from "@/components/core/share-instance-modal";
import { QrCode, Share } from "@mui/icons-material";
import QRModal from "@/components/core/qr-modal";
const MODAL_STYLE = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
};

const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
};

const UserDataTable = ({ handleFetch, setPage, page, setLimit, limit, totalRecords = 0, setTotalRecords, dataRow, isLoading, setSearch, selectedData, setSelectedData, handleEditModal }: { handleFetch: () => Promise<void>, setTotalRecords: (page: number) => void, setSearch: (val: string) => void, totalRecords: number, setPage: (page: number) => void, selectedData: User | null, setSelectedData: (data: User) => void, page: number, setLimit: (limit: number) => void, limit: number, dataRow: User[], isLoading: boolean, handleEditModal: (stat: boolean) => void }) => {
    const [modalOpen, setModalOpen] = React.useState(false);
    const [isPending, setIsPending] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [openQr, setOpenQr] = React.useState(false);

    const handleOpenDelete = (data: User) => {
        setSelectedData(data);
        setModalOpen(true);
    };
    const handleOpenEditModal = (data: User) => {
        setSelectedData(data);
        handleEditModal(true);
    };
    function encodeId(id: string): string {
        const base64 = Buffer.from(id.toString()).toString('base64');
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }


    const columns = [
        {
            field: "name", name: "Name", formatter: (row: User) => (
                <div className="table-data-wrapper">
                    <Typography className="table-title" variant="body2">{row.fullName || row.username}</Typography>
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
                                    {new Date(row.createdAt).toLocaleString("en-US", options)}
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
                                    {new Date(row.updatedAt).toLocaleString("en-US", options)}
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
                            <IconButton className="btn-cstm" onClick={() => handleOpenDelete(row)}>
                                <DeleteIcon />
                            </IconButton>
                            <IconButton className="btn-cstm" onClick={() => handleOpenEditModal(row)}>
                                <ModeEditIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </div>
            )
        },
        {
            field: "role", name: "Role", width: '200px',
            formatter: (row: User) => <Badge color={row.role === 'admin' ? 'error' : 'primary'} sx={{ textTransform: "capitalize" }}>{row.role}</Badge>
        },
        {
            field: "createdAt", name: "Added Date", width: '200px',
            formatter: (row: User) => new Date(row.createdAt).toLocaleString("en-US", options)
        },
        {
            field: "updatedAt", name: "Updated Date", width: '200px', formatter: (row: User) => new Date(row.updatedAt).toLocaleString("en-US", options),
        },
        {
            formatter: (row: User) => (
                <Stack direction="row" spacing={1} >
                    <IconButton
                        component={RouterLink}
                        href={paths.dashboard.userDetail(row._id)}
                    >
                        <ModeEditIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => handleOpenDelete(row)}
                    >
                        <DeleteIcon />
                    </IconButton >
                </Stack>
            ), name: "Actions", width: "200px"
        },
    ];

    const handleDelete = async () => { }
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

export default UserDataTable