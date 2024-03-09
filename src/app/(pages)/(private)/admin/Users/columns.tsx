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
import { Ban } from "@/functions/admin/banUser";

export type User = {
	id: number;
	username: string;
	role: string;
};

export const columns: ColumnDef<User>[] = [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "username",
		header: "Username",
	},
	{
		accessorKey: "role",
		header: "Role",
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const user = row.original;

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
						<DropdownMenuItem onClick={() => Ban(user.id)}>Ban</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Edit</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
