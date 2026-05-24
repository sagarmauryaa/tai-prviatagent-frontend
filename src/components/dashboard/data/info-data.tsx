"use client"
import * as React from "react";
import InfoDataTable from "@/components/dashboard/data/info-data-table";
import { Card } from "@mui/material";
import TextForm from "@/components/dashboard/data/text-form";
import FileUploadForm from "@/components/dashboard/data/file-upload-form";
import PDFUrlForm from "@/components/dashboard/data/pdfUrl-form";
import CSVFileUploadForm from "@/components/dashboard/data/csv-file-form";
import WebPageForm from "@/components/dashboard/data/webpage-form";
import { InfoDataEditModal } from "@/components/dashboard/data/info-data-edit-modal";
import { TextMetaDataModal } from "@/components/dashboard/data/text-metadata-modal";
import { FileMetaDataModal } from "@/components/dashboard/data/file-metadata-modal";
import { useAuth } from "@/components/auth/auth-context";
import { useRouter } from "next/navigation";
import { getInfoData } from "@/utils/backend-endpoints";
import { toast } from "sonner";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddDataForm from "./add-data-form";

interface InfoDataType {
    brandId: string;
    createdTime: number;
    isDeleted: boolean;
    merchantId: string;
    textMetaDataCount: number;
    fileMetaDataCount: number;
    dataSize?: number;
    sourceType?: string;
    webpageUrl?: string;
    text: string;
    updatedTime: number;
    _id: string;
}

const InfoData = ({ searchParams }: { searchParams: Record<string, string> }) => {
    const { editId, infoTextMetaDataID, infoFileMetaDataID } = searchParams;
    const { selectedBrand } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(true);
    const [dataRow, setDataRow] = React.useState<InfoDataType[]>([]);
    const [page, setPage] = React.useState(0);
    const [limit, setLimit] = React.useState(10);
    const [seaechVal, setSearchVal] = React.useState('');
    const [totalRecords, setTotalRecords] = React.useState(0);

    const fetchData = React.useCallback(async () => {
        if (!selectedBrand?._id) return;
        setIsLoading(true);
        try {
            const { data, status } = await getInfoData(selectedBrand._id, page + 1, limit, seaechVal);
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
    }, [selectedBrand, page, limit, seaechVal]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData, router]);

    return (
        <>
            <AddDataForm fetchData={fetchData} /> 
            {/* <CSVFileUploadForm />  */}
            <Grid container spacing={4}>
                <Stack direction={'column'} spacing={3} sx={{ alignItems: "flex-start", width: '100%' }}>
                    <Box sx={{ flex: "1 1 auto" }}>
                        <Typography variant="h5">Data Sources</Typography>
                    </Box>
                    <Card sx={{ width: "100%" }} className="additional-data data-table">
                        {/* <Box sx={{overflow:'auto'}}> */}

                        <InfoDataTable setSearch={setSearchVal} setLimit={setLimit} limit={limit} page={page} setPage={setPage} totalRecords={totalRecords} setTotalRecords={setTotalRecords} handleFetch={fetchData} dataRow={dataRow} isLoading={isLoading}  />
                        {/* </Box> */}
                    </Card>
                </Stack>
            </Grid>
            <InfoDataEditModal infoId={editId} fetchData={fetchData} />
            <TextMetaDataModal infoId={infoTextMetaDataID} fetchInfoData={fetchData}  />
            <FileMetaDataModal infoId={infoFileMetaDataID} fetchInfoData={fetchData} />
        </>
    )
}

export default InfoData