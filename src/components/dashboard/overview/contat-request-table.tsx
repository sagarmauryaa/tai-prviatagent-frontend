'use client';
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DataTable } from "@/components/core/data-table";
import { Card, Divider, Stack, TablePagination } from "@mui/material";
import { getContacRequest, getUnansweredQuestion } from "@/utils/backend-endpoints";
import PaginatedDataTable from "@/components/core/paginated-data-table";
import { useSearchParams } from "next/navigation";


interface columnsProps extends Array<{
    field: string;
    name: string;
    width?: string;
}> { }


const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
};
interface rowDataType {
    _id: string;
    brandId: string;
    name: string;
    description: string; 
    createdTime: number; 
}

const columns = [ 
    { field: "name", name: "Name", width: "200px" },
    { field: "email", name: "Email", width: "200px" },
    { field: "contactNumber", name: "Phone", width: "150px" },
    { field: "brandName", name: "Brand", width: "150px" },
    {
        field: "createdTime", name: "Added Date", width: '150px',
        formatter: (row: rowDataType) => new Date(row.createdTime).toLocaleString("en-US", options),
    },
];

interface metaDataType {
    totalRecords: number,
    currentPage: number,
    limit: number,
    totalPages: number,
}
interface filtersTyepe {
    type?: string;
    start_date?: string;
    end_date?: string;
    brand?: string;
}
const ContactRequestTable = ( ) => {
     const searchParams = useSearchParams();
    const [filtterData, setFilterData] = React.useState([]);
    const [metaData, setMetaData] = React.useState<metaDataType>(
        {
            totalRecords: 0,
            currentPage: 1,
            limit: 10,
            totalPages: 0,
        }
    );
    const [page, setPage] = React.useState<number>(0);
    const [limit, setLimit] = React.useState<number>(10);
    const [loading, setLoading] = React.useState(false);

    
    const handleUnaswredQuestion = React.useCallback(async () => {
        try {
            const params = Object.fromEntries(searchParams.entries());
            const filters = {
                type: params.type ?? "month",
                start_date: params.start_date ?? "",
                end_date: params.end_date ?? "",
                brand: params.brand ?? "all",
            };
            setLoading(true);
            const filterParams = {
                type: filters.type ?? "month",
                start_date: filters.start_date ?? "",
                end_date: filters.end_date ?? "",
                brand: filters.brand ?? "all",
            }; 

            const { data, status } = await getContacRequest(filterParams, page + 1, limit);
            if (status === 200) { 

                setFilterData(data.data.data ?? []);
                setMetaData(data.data.metadata);
            }
        }
        catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, [searchParams, page, limit]);

    React.useEffect(() => {
        handleUnaswredQuestion();
    }, [searchParams, page, limit]);

    // console.log(page, limit, "page and limit");


    return (
        <React.Fragment>
            <Stack direction={"column"} spacing={2} sx={{ alignItems: "flex-start" }}>
                <Box sx={{ flex: "1 1 auto" }}>
                    <Typography variant="h5">Contact Request ({metaData.totalRecords ?? 0})</Typography>
                </Box>
                <Card sx={{ width: "100%" }} className="contact-request data-table">
                    <PaginatedDataTable setLimit={setLimit} limit={limit} isLoading={loading} columns={columns} setPage={setPage} dataRow={filtterData} totalRecords={metaData.totalRecords ?? 0} page={page} />
                </Card>
            </Stack>
        </React.Fragment>
    );
};

export default ContactRequestTable;