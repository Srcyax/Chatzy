import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { title } from "process";
import { ReactNode, useState } from "react";

type ForumProps = {
	id: number;
	title: string;
	description: string;
	icon: ReactNode;
};

type ThreadProps = {
	id: number;
	title: string;
	description: string;
	author: string;
};

export function Thread(thread: ForumProps) {
	const [lastThread, setLastThread] = useState<ThreadProps>();

	const { data, isLoading } = useQuery({
		queryKey: ["get-last-thread"],
		queryFn: async () => {
			axios
				.post("/api/forum/listThread/last", {
					forum: thread.title,
				})
				.then((res) => {
					setLastThread(res.data.lastThread);
				});
		},
	});

	if (isLoading) {
		return <></>;
	}

	return (
		<div className="flex justify-between w-full px-5 py-1">
			<div className="flex items-center gap-4">
				{thread.icon}

				<div>
					<Link
						className="font-semibold text-xl text-orange-400 hover:underline"
						href={`/forum/${thread.title}`}
					>
						{thread.title}
					</Link>
					<p className="text-[15px]">{thread.description}</p>
				</div>
			</div>

			<div className="flex gap-4 items-center w-32 mx-2">
				<Avatar className="cursor-pointer hover:border border-orange-400">
					<AvatarImage src="" alt="@shadcn" />
					<AvatarFallback>{lastThread?.author.charAt(0).toUpperCase()}</AvatarFallback>
				</Avatar>
				<div className="flex flex-col w-full">
					<h1 className="font-semibold w-2/4 truncate">{lastThread?.title}</h1>
					<p className="text-[15px] text-zinc-600 w-24 truncate">{lastThread?.description}</p>
				</div>
			</div>
		</div>
	);
}
