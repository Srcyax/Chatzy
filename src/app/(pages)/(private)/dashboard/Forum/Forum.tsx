import { NotebookIcon } from "lucide-react";
import { Thread } from "./Thread";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

type ForumProps = {
	id: number;
	title: string;
	description: string;
};

export default function Forum() {
	const [forums, getForums] = useState<ForumProps[]>();

	const { data, isLoading, isError } = useQuery({
		queryKey: ["list-forums"],
		queryFn: async () => {
			return axios.get("/api/admin/forums/listForums").then((res) => getForums(res.data.forums));
		},
		refetchOnWindowFocus: false,
	});

	return (
		<div className="m-10 flex gap-12 laptop:flex-row tablet:flex-col smartphone:flex-col">
			<div className="flex flex-col gap-4 w-full pb-5 border shadow-lg rounded-md">
				<div className="w-full p-4 shadow-lg">
					<h1 className="text-2xl font-bold">Forum</h1>
				</div>
				{isLoading ? (
					<>
						<div className="flex justify-between gap-4 w-full py-1 px-5 rounded-lg">
							<div className="flex gap-4">
								<Skeleton className="w-10 h-10 rounded-full" />
								<div className="flex flex-col gap-2">
									<Skeleton className="w-10 h-4 rounded-sm" />
									<Skeleton className="w-16 h-4 rounded-sm" />
								</div>
							</div>
							<div className="flex gap-4">
								<Skeleton className="w-10 h-10 rounded-full" />
								<div className="flex flex-col gap-2">
									<Skeleton className="w-12 h-4 rounded-sm" />
									<Skeleton className="w-24 h-4 rounded-sm" />
								</div>
							</div>
						</div>
					</>
				) : (
					<>
						{forums?.map((forum, index) => (
							<Thread
								key={index}
								id={forum.id}
								icon={<NotebookIcon />}
								title={forum.title}
								description={forum.description}
							/>
						))}
					</>
				)}
			</div>
		</div>
	);
}
