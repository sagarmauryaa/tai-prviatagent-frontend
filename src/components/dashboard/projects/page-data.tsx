"use client";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Button, Card } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import InstanceForm from "./form-modal";
import { toast } from "sonner";
import { getInstance } from "@/utils/backend-endpoints";
import InstanceDataTable from "./data-table";
import { useAuth } from "@/components/auth/auth-context";

export interface InfoDataType {
    _id: string;
    name: string;
    tellofyBrandUrl: string;
    createdTime: string;
    modifiedTime: string;
    chatbotVisibility?: string;
}


const ProjectsPageData = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');
    const [totalRecords, setTotalRecords] = useState(0);
    const [dataRow, setDataRow] = useState<any[]>([]);
    const [selectedData, setSelectedData] = useState<InfoDataType | null>(null);
    const { currentSubscription } = useAuth();

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data, status } = await getInstance(page + 1, limit, search);
            if (status === 200) {
                setIsLoading(false);
                setDataRow(data?.data?.data || []);
                setTotalRecords(data?.data.pagination?.totalRecords ?? 0);
            }
        } catch (error) {
            setIsLoading(false);
            console.error("Error fetching data:", error);
            toast.error("Failed to fetch data.");
        }
    }, [page, limit, search]);

    useEffect(() => {
        fetchData();
    }, [fetchData, limit, page]);

    return (
        <>
            <Stack spacing={4}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "flex-start" }}>
                    <Box sx={{ flex: "1 1 auto", width: "100%" }}>
                        <Stack spacing={4}>
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
                                <Typography variant="h4">Projects</Typography>
                                <Stack direction="row" spacing={3} alignItems="center">
                                    <Typography variant="body2" color="text.secondary">
                                        {currentSubscription ? (
                                            `${totalRecords} of ${currentSubscription?.instance ?? 1} Projects used`
                                        ) : (
                                            'No subscription available'
                                        )}
                                    </Typography>
                                    <Button disabled={(currentSubscription?.instance ?? 0) <= totalRecords} variant="contained" onClick={() => { setSelectedData(null); setModalOpen(true) }}>Add Projects</Button>
                                </Stack>
                            </Stack>
                            <Card sx={{ width: "100%" }} className="instance-table data-table">
                                <InstanceDataTable setSelectedData={setSelectedData} selectedData={selectedData} setSearch={setSearch} setLimit={setLimit} limit={limit} handleEditModal={setModalOpen} page={page} setPage={setPage} totalRecords={totalRecords} setTotalRecords={setTotalRecords} handleFetch={fetchData} dataRow={dataRow} isLoading={isLoading} />
                            </Card>
                        </Stack>
                    </Box>
                </Stack>
            </Stack>
            <InstanceForm data={selectedData} handleFetch={fetchData} open={modalOpen} handleModal={(status: boolean) => setModalOpen(status)} />
        </>
    )
}

export default ProjectsPageData