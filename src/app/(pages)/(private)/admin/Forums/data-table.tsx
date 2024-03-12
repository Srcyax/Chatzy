"use client";

import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useMemo, useState } from "react";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
	const pageSize = 5;

	const pages: TData[][] = useMemo(() => {
		return data
			? data.reduce((acc, item, index) => {
					const pageIndex: number = Math.floor(index / pageSize);
					if (!acc[pageIndex]) {
						acc[pageIndex] = [];
					}
					acc[pageIndex].push(item);
					return acc;
			  }, [] as TData[][])
			: [];
	}, [data]);

	const [currentPage, setCurrentPage] = useState(0);

	const currentData = useMemo(() => {
		return pages[currentPage];
	}, [pages, currentPage]);

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const table = useReactTable({
		data: currentData || [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			columnFilters,
		},
	});

	return (
		<div>
			<div className="flex items-center py-5">
				<Input
					placeholder="Filter title..."
					value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
					onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
					className="max-w-sm"
				/>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<Button
					variant="outline"
					size="sm"
					onClick={() => setCurrentPage((currentPage) => Math.max(currentPage - 1, 0))}
					disabled={currentPage === 0}
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => setCurrentPage((currentPage) => Math.min(currentPage + 1, pages.length - 1))}
					disabled={currentPage === pages.length - 1 || table.getRowModel().rows?.length <= 0}
				>
					Next
				</Button>
			</div>
		</div>
	);
}
