"use client";

import { ColumnDef } from "@tanstack/react-table";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

export type ForumProps = {
	id: number;
	title: string;
	description: string;
};

export const columns: ColumnDef<ForumProps>[] = [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "title",
		header: "Title",
	},
	{
		accessorKey: "description",
		header: "Description",
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const forum = row.original;
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => {
								return toast.promise(
									axios
										.post("/api/admin/forums/delete", {
											id: forum.id,
										})
										.then((res) => {}),
									{
										loading: "Deleting...",
										success: "Deleted successfully",
										error: "Error when deleting",
									}
								);
							}}
						>
							Delete
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Edit</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
