"use client";

import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

interface Column {
  name: string;
  field?: string;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  hideName?: boolean;
  formatter?: (row: any, index: number) => React.ReactNode;
}

interface DataTableProps extends React.ComponentProps<typeof Table> {
  columns: Column[];
  hideHead?: boolean;
  hover?: boolean;
  onRowClick?: (event: React.MouseEvent, row: any) => void;
  onDeselectAll?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeselectOne?: (event: React.ChangeEvent<HTMLInputElement>, row: any) => void;
  onSelectOne?: (event: React.ChangeEvent<HTMLInputElement>, row: any) => void;
  onSelectAll?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rows: any[];
  selectable?: boolean;
  selected?: Set<string | number>;
  uniqueRowId?: (row: any) => string | number;
}

export function DataTable({
	columns,
	hideHead,
	hover,
	onRowClick,
	onDeselectAll,
	onDeselectOne,
	onSelectOne,
	onSelectAll,
	rows,
	selectable,
	selected,
	uniqueRowId,
	...props
}: DataTableProps) {
	const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
	const selectedAll = rows.length > 0 && selected?.size === rows.length;

	return (
		<Table {...props}>
			<TableHead sx={{ ...(hideHead && { visibility: "collapse", "--TableCell-borderWidth": 0 }) }}>
				<TableRow>
					{selectable ? (
						<TableCell padding="checkbox" sx={{ width: "40px", minWidth: "40px", maxWidth: "40px" }}>
							<Checkbox
								checked={selectedAll}
								indeterminate={selectedSome}
								onChange={(event) => {
									if (selectedAll) {
										onDeselectAll?.(event);
									} else {
										onSelectAll?.(event);
									}
								}}
							/>
						</TableCell>
					) : null}
					{columns.map((column) => (
						<TableCell
							key={column.name}
							sx={{
								width: column.width,
								minWidth: column.width,
								maxWidth: column.width,
								...(column.align && { textAlign: column.align }),
							}}
						>
							{column.hideName ? null : column.name}
						</TableCell>
					))}
				</TableRow>
			</TableHead>
			<TableBody>
				{rows.map((row, index) => {
					const rowId = row.id ?? uniqueRowId?.(row);
					const rowSelected = rowId ? selected?.has(rowId) : false;

					return (
						<TableRow
							hover={hover}
							key={rowId ?? index}
							selected={rowSelected}
							{...(onRowClick && {
								onClick: (event: React.MouseEvent) => {
									onRowClick(event, row);
								},
							})}
							sx={{ ...(onRowClick && { cursor: "pointer" }) }}
						>
							{selectable ? (
								<TableCell padding="checkbox">
									<Checkbox
										checked={rowId ? rowSelected : false}
										onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
											if (rowSelected) {
												onDeselectOne?.(event, row);
											} else {
												onSelectOne?.(event, row);
											}
										}}
										onClick={(event: React.MouseEvent) => {
											if (onRowClick) {
												event.stopPropagation();
											}
										}}
									/>
								</TableCell>
							) : null}
							{columns.map((column) => (
								<TableCell key={column.name} sx={{ ...(column.align && { textAlign: column.align }) }}>
									{column.formatter
										? column.formatter(row, index)
										: column.field
											? <span>{row[column.field]}</span>
											: null}
								</TableCell>
							))}
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}
