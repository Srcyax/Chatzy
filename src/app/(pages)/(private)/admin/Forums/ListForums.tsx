import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

import { ThreadProps, columns } from "./columns";
import { DataTable } from "./data-table";
import { CreateForum } from "./CreateForum";

export default function ListForums() {
	const [users, getUsers] = useState<ThreadProps[]>([]);

	useQuery({
		queryKey: ["list-users"],
		queryFn: async () => {
			await axios.get("/api/admin/forums/listForums").then((res) => {
				getUsers(res.data.forums);
			});

			return "";
		},
		refetchInterval: 5000,
	});

	return (
		<div className="container mx-auto h-96">
			<CreateForum />
			<DataTable columns={columns} data={users} />
		</div>
	);
}
