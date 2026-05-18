'use client';
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DataTable } from "@/components/core/data-table";
import { Card, debounce, Divider, Stack, TablePagination } from "@mui/material";
import { getUnansweredQuestion } from "@/utils/backend-endpoints";
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

const columns = [
    { field: "content", name: "Question", width: "150px" },
    { field: "brandName", name: "Instance Name", width: "150px" },
    { field: "questionAskedTime", name: "Asked On", width: "150px", formatter: (row: any) => {
        const date = new Date(row.questionAskedTime);
        return date.toString() === 'Invalid Date' 
            ? new Date(row.createdTime).toLocaleString("en-US", options)
            : date.toLocaleString("en-US", options);
    }},
    {
        field: "createdTime", name: "Updated Date", width: '150px', formatter: (row: any) => new Date(row.createdTime).toLocaleString("en-US", options),
    },
];

interface UnansweredQuestion {
    id: string;
    question: string;
    brand: string;
    askedDate: string;
}

interface metaDataType {
    totalRecords: number,
    currentPage: number,
    limit: number,
    totalPages: number,
}
const UnansweredTable = () => {
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
    const [seaechVal, setSearchVal] = React.useState('');



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

            const { data, status } = await getUnansweredQuestion(filterParams, page + 1, limit, seaechVal);
            if (status === 200) {
                console.log();

                setFilterData(data.data.unansweredQuestions ?? []);
                setMetaData(data.data.metadata);
            }
        }
        catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, [searchParams, page, limit, seaechVal]);
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        debounce(() => {
            setSearchVal(event.target.value);
        }, 2000)()
    }

    React.useEffect(() => {
        // if (searchParams) {
            handleUnaswredQuestion();
            // } 
    }, [searchParams, page, limit,seaechVal]);

    



    return (
        <React.Fragment>
            <Stack direction={"column"} spacing={2} sx={{ alignItems: "flex-start" }}>
                <Box sx={{ flex: "1 1 auto" }}>
                    <Typography variant="h5">Unanswered Questions ({metaData.totalRecords ?? 0})</Typography>
                </Box>
                <Card sx={{ width: "100%" }} className="Unanswered-questions data-table">
                    <PaginatedDataTable handleSearch={handleSearch} setLimit={setLimit} limit={limit} isLoading={loading} columns={columns} setPage={setPage} dataRow={filtterData} totalRecords={metaData.totalRecords ?? 0} page={page} />
                </Card>
            </Stack>
        </React.Fragment>
    );
};

export default UnansweredTable;