"use client";
import { Card } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getInstance, getUsers } from "@/utils/backend-endpoints";
import UserDataTable from "./UserDataTable";


const UserListing = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');
    const [totalRecords, setTotalRecords] = useState(0);
    const [dataRow, setDataRow] = useState<any[]>([]);
    const [selectedData, setSelectedData] = useState<User | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data, status } = await getUsers(page + 1, limit, search);
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
        <Card sx={{ width: "100%" }} className="instance-table data-table">
            <UserDataTable setSelectedData={setSelectedData} selectedData={selectedData} setSearch={setSearch} setLimit={setLimit} limit={limit} handleEditModal={setModalOpen} page={page} setPage={setPage} totalRecords={totalRecords} setTotalRecords={setTotalRecords} handleFetch={fetchData} dataRow={dataRow} isLoading={isLoading} />
        </Card>

    )
}

export default UserListing