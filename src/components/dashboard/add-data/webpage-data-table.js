"use client";
import * as React from "react";
import RouterLink from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DataTable } from "@/components/core/data-table";
import { Button, Card, CardContent, IconButton, Modal, Stack } from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from '@mui/icons-material/Delete';
import { paths } from "@/paths";

const MODAL_STYLE = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
};

const WebPageDataTable = ({ rows = [] }) => {
    const [modalOpen, setModalOpen] = React.useState(false);

    const handleDelete = React.useCallback(() => {
        setModalOpen(false);
    }, []);


    const columns = [
        { field: "id", name: "#", width: "50px" },
        { field: "data", name: "Data" },
        {
            formatter: (row) => (
                <Stack direction="column" spacing={1} >
                    <Stack direction="column" >
                        <Typography variant="caption">Added Time</Typography>
                        <Typography color="text.primary" variant="subtitle2">
                            {row.added_time}
                        </Typography>
                    </Stack>
                    <Stack direction="column" >
                        <Typography variant="caption">Updated Time</Typography>
                        <Typography color="text.primary" variant="subtitle2">
                            {row.updated_time}
                        </Typography>
                    </Stack>
                </Stack>
            ), name: "Date Time",
            width: '180px'
        },
        {
            formatter: (row) => (
                <Stack direction="row" spacing={1} >
                    <IconButton
                        onClick={() => setModalOpen(true)}
                    >
                        <DeleteIcon />
                    </IconButton >
                    <IconButton component={RouterLink} href={paths.dashboard.infoDataEditPreview("1")}
                    >
                        <ModeEditIcon />
                    </IconButton >
                </Stack>
            ), name: "Action"
        },
    ];
    return (
        <React.Fragment>
            <DataTable columns={columns} rows={rows} />
            {rows.length === 0 ? (
                <Box sx={{ p: 3 }}>
                    <Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
                        No Data found
                    </Typography>
                </Box>
            ) : null}
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="delete-confirmation-modal"
            >
                <Box sx={MODAL_STYLE}>
                    <Card sx={{ width: "100%" }}>
                        <CardContent>
                            <Typography variant="h6" component="h2">
                                Are you sure?
                            </Typography>
                            <Typography sx={{ mt: 2 }}>
                                Do you want to delete additional info?
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
                                <Button variant="text" onClick={() => setModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button variant="contained"   onClick={handleDelete}>
                                    Delete
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Box>
            </Modal>
        </React.Fragment>
    )
}

export default WebPageDataTable