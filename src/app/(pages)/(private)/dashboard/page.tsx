"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChatBoard } from "./Chat/Chat";
import { ActiveUsers } from "./activeUsers";
import Header from "@/app/header";
import { NotebookIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Dashboard() {
	const router = useRouter();

	const { data, isLoading, isError } = useQuery({
		queryKey: ["authentication"],
		queryFn: async () => {
			return axios
				.get("/api/user/auth")
				.then((res) => res.data)
				.catch(() => {
					return router.push("/login");
				});
		},
		refetchInterval: 5000,
	});

	if (isLoading) {
		return <></>;
	}

	if (isError) {
		return <></>;
	}

	const { username, role } = data?.user;

	return (
		<div>
			<Header username={username} role={role} />
			<main>
				<div className="m-10 flex gap-12 laptop:flex-row tablet:flex-col smartphone:flex-col">
					<ChatBoard role={role} />
					<ActiveUsers />
				</div>
				<div className="m-10 flex gap-12 laptop:flex-row tablet:flex-col smartphone:flex-col">
					<div className="flex flex-col gap-4 w-full h-96  border shadow-lg rounded-md">
						<div className="w-full p-4">
							<h1 className="text-2xl font-bold">Forum</h1>
						</div>
						<div className="flex justify-between w-full shadow-lg p-5">
							<div className="flex items-center gap-4">
								<NotebookIcon />
								<div>
									<h1 className="font-semibold text-xl">News</h1>
									<p>Important announcements for everyone.</p>
								</div>
							</div>
							<div className="flex gap-4 items-center">
								<Avatar className="cursor-pointer shadow-md hover:border border-orange-400">
									<AvatarImage src="" alt="@shadcn" />
									<AvatarFallback>U</AvatarFallback>
								</Avatar>
								<div className="flex flex-col">
									<h1 className="font-semibold">We accept payme...</h1>
									<p className="text-[15px] text-zinc-600">29 October 2023</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
