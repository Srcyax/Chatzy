import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

import { User, columns } from "./columns";
import { DataTable } from "./data-table";

export default function ListAllUsers() {
	const [users, getUsers] = useState<User[]>([]);

	useQuery({
		queryKey: ["list-users"],
		queryFn: async () => {
			await axios.get("/api/admin/users/listall").then((res) => {
				getUsers(res.data.users);
			});

			return "";
		},
		refetchInterval: 5000,
	});

	return (
		<div className="container mx-auto h-96">
			<DataTable columns={columns} data={users} />
		</div>
	);
}
