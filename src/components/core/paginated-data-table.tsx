import React from "react";
import {
	Box,
	CircularProgress,
	Divider,
	OutlinedInput,
	Stack,
	styled,
	TablePagination,
	Typography,
} from "@mui/material";

import { DataTable } from "./data-table";
import { SearchTableWrapper } from "./paginated-data-table.style";

interface PaginatedDataTableType {
	isLoading: boolean;
	totalRecords: number;
	limit: number;
	page: number;
	dataRow: any[];
	columns: any[];
	setPage: (page: number) => void;
	setLimit: (page: number) => void;
	handleSearch?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const PaginatedDataTable: React.FC<PaginatedDataTableType> = ({
	setLimit,
	limit = 10,
	isLoading = false,
	columns = [],
	dataRow = [],
	totalRecords = 0,
	page = 0,
	setPage = () => { },
	handleSearch,
}) => {
	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		 setLimit(parseInt(event.target.value, 10));
	};
	

	return (
		<SearchTableWrapper sx={{ overflow: "auto" }} className="search-table-wrapper">
			<Box className="search-bar">
				{handleSearch && (
					<>
						<Stack sx={{ padding: "10px", alignItems: "flex-end" }}>
							<OutlinedInput className="table-data-search" type="search" onChange={handleSearch} placeholder="Seach" />
						</Stack>
						<Divider />
					</>
				)}
			</Box>


			{isLoading ? (
				<Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
					<CircularProgress size={20} color="inherit" />
				</Box>
			) :
				dataRow.length > 0 ? (
					<>
						<DataTable columns={columns} rows={dataRow} sx={{ width: "100%" }} />
						<TablePagination
							rowsPerPage={limit}
							onRowsPerPageChange={handleChangeRowsPerPage}
							component="div"
							count={totalRecords}
							page={page}
							onPageChange={(_, newPage) => setPage(newPage)}
							style={{ position: "sticky", left: 0, overflow: "visible" }}
							className="table-pagination"
						/>
					</>
				) : dataRow.length === 0 ? (
					<Box sx={{ p: 3 }}>
						<Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
							No Data found
						</Typography>
					</Box>
				) : null}


		</SearchTableWrapper>
	);
};

export default PaginatedDataTable;
