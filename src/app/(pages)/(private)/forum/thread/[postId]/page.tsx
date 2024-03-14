"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type User = {
	id: number;
	username: string;
	role: string;
};

type Thread = {
	id: number;
	title: string;
	description: string;
};

export default function Page({ params }: any) {
	const router = useRouter();
	const [user, getUser] = useState<User>();
	const [thread, getThread] = useState<Thread>();
	const { data, isLoading } = useQuery({
		queryKey: ["get-thread"],
		queryFn: async () => {
			return axios
				.post("/api/forum/thread", {
					id: parseInt(params.postId),
				})
				.then((res) => {
					getThread(res.data.thread);
					axios
						.get("/api/forum/createThread/profile")
						.then((res) => getUser(res.data.userProfile))
						.catch(() => {
							return router.push("/dashboard");
						});
				})
				.catch(() => router.push("/dashboard"));
		},
	});

	return (
		<div>
			<main className="m-16 flex flex-col gap-5">
				<div>
					<Button
						className="h-9"
						onClick={() => {
							router.back();
						}}
					>
						<Undo2 />
					</Button>
				</div>
				<div className="flex laptop:flex-row tablet:flex-col smartphone:flex-col gap-2 smartphone:gap-4 w-full">
					<div className="flex flex-col gap-2 items-center justify-start border-2 shadow-3xl px-16 py-5 h-64 rounded-md">
						{isLoading ? (
							<Skeleton className="w-20 h-20 rounded-full" />
						) : (
							<Avatar className="shadow-xl w-20 h-20">
								<AvatarImage src="" />
								<AvatarFallback>{user?.username.charAt(0).toUpperCase()}</AvatarFallback>
							</Avatar>
						)}
						<div className="flex flex-col gap-2 items-center">
							{isLoading ? (
								<div className="flex flex-col gap-2 items-center">
									<Skeleton className="w-16 h-4" />
									<Skeleton className="w-5 h-4" />
								</div>
							) : (
								<div className="flex flex-col gap-2 items-center">
									<h1 className={`${user?.role === "banned" ? "line-through" : ""}`}>{user?.username}</h1>
									<div className="px-5 bg-zinc-800 text-white rounded-sm">
										<h1>{user?.role}</h1>
									</div>
									<h1>id: {user?.id}</h1>
								</div>
							)}
						</div>
					</div>
					<div className="flex flex-col gap-2 items-center justify-center w-full border-2 shadow-3xl p-5 rounded-md">
						<div className="w-full h-full">
							<div className="flex flex-col gap-2">
								{isLoading ? (
									<>
										<Skeleton className="w-96 smartphone:w-48 h-4" />
										<Skeleton className="w-72 smartphone:w-40 h-4" />
									</>
								) : (
									<>
										<h1>{thread?.title}</h1>
										<p>{thread?.description}</p>
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
