import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

import { ForumProps, columns } from "./columns";
import { DataTable } from "./data-table";
import { CreateForum } from "./CreateForum";

export default function ListForums() {
	const [forums, getForums] = useState<ForumProps[]>([]);

	const { isLoading, isError } = useQuery({
		queryKey: ["list-forums"],
		queryFn: async () => {
			await axios.get("/api/admin/forums/listForums").then((res) => {
				getForums(res.data.forums);
			});

			return "";
		},
		refetchInterval: 5000,
	});

	if (isLoading) {
		return <></>;
	}

	return (
		<div className="container mx-auto h-96">
			<CreateForum />
			<DataTable columns={columns} data={forums} />
		</div>
	);
}
