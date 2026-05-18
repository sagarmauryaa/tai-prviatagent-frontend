"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

import { Option } from "@/components/core/option";
import { InputLabel } from "@mui/material";
import { paths } from "@/paths";
import { useAuth } from "@/components/auth/auth-context";
import { Replay } from "@mui/icons-material";
import { DashboardFilters } from "./style";

const OverviewFilter = ({ filters = { type: "month", start_date: "", end_date: "", brand: "all" }, setFilters = () => { }, handleApplyFilter = () => { } }: { filters: { type?: string; start_date?: string; end_date?: string; brand?: string }, setFilters: (filters: any) => void, handleApplyFilter: (e: any) => void }) => {
	const { brands } = useAuth();


	const handleSortChange = (event: any) => {
		const { name, value } = event.target;
		setFilters((prevFilter: any) => ({
			...prevFilter,
			[name]: value,
		}));
	};
	const handleDateChange = (key: string, value: any) => {
		setFilters((prevFilter: any) => ({
			...prevFilter,
			[key]: `${value.get("month") + 1}-${value.date()}-${value.year()}`,
		}));
	};



	return (
		<DashboardFilters className="filter-wrapper">
			<Stack direction={{ xs: "column", sm: "row" }} spacing={2} >
				<Stack direction={"row"} sx={{ flexWrap: "wrap" }} spacing={2} className="filter-dropdown-wrap" >
					<Stack className="filter-dropdown">
						<InputLabel>Filter by</InputLabel>
						<Select name="type" label="Filter by" onChange={handleSortChange} value={filters.type}>
							<Option value="month">This Month</Option>
							<Option value="week">This Week</Option>
							<Option value="last month">Last Month</Option>
							<Option value="year">This Year</Option>
							<Option value="other">Other</Option>
						</Select>
					</Stack>
					{filters.type === "other" ? (
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DatePicker
								name="start_date"
								label="Start Date"
								onChange={(value) => {
									handleDateChange("start_date", value);
								}}
								value={filters.start_date ? dayjs(filters.start_date, "M-D-YYYY") : null}
								shouldDisableDate={(date) => Boolean(filters.end_date && date.isAfter(dayjs(filters.end_date, "M-D-YYYY")))}

							/>
							<DatePicker
								label="End Date"
								name="end_date"
								onChange={(value) => {
									handleDateChange("end_date", value);
								}}
								value={filters.end_date ? dayjs(filters.end_date, "M-D-YYYY") : null}
								shouldDisableDate={(date) => Boolean(filters.start_date && date.isBefore(dayjs(filters.start_date, "M-D-YYYY")))}
							/>
						</LocalizationProvider>
					) : null}
					<Stack className="filter-dropdown">
						<InputLabel>Brand</InputLabel>
						<Select name="brand" label="Brand" onChange={handleSortChange} value={filters.brand}>
							<Option value={'all'}>
								All Instances
							</Option>
							{
								brands?.map((brand) => (
									<Option key={brand._id} value={brand._id}>
										{brand.name}
									</Option>
								))
							}
						</Select>
					</Stack>
				</Stack>
				<Button type="submit" variant="contained" onClick={handleApplyFilter} sx={{ flex: "1 1 auto", height: 38, mt: 'auto', mb: '2px' }}>
					Apply Filters
				</Button>
			</Stack>
		</DashboardFilters>
	);
};

export default OverviewFilter;
