"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Undo2, ShieldAlert, Reply } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Comment } from "./Components/Comments";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
			await axios
				.post("/api/forum/thread", {
					id: parseInt(params.postId),
				})
				.then((res) => {
					getThread(res.data.thread);
					axios
						.post("/api/forum/thread/profile", {
							threadId: parseInt(params.postId),
						})
						.then((res) => {
							getUser(res.data.userProfile);
						})
						.catch(() => {
							return router.push("/dashboard");
						});
				})
				.catch(() => router.push("/dashboard"));

			return "";
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
						{isLoading || !user ? (
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
									<Skeleton className="w-28 h-6" />
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
						<div className="flex w-full h-full">
							<div className="flex-1">
								<div className="flex flex-col gap-2">
									{isLoading ? (
										<>
											<Skeleton className="w-96 smartphone:w-48 h-4" />
											<Skeleton className="w-72 smartphone:w-40 h-4" />
										</>
									) : (
										<>
											<h1 className="text-3xl font-bold">{thread?.title}</h1>
											<p>{thread?.description}</p>
										</>
									)}
								</div>
							</div>
							<div className="flex gap-2">
								<ShieldAlert width={20} />
								<Reply width={20} />
							</div>
						</div>
					</div>
				</div>
				<Comment id={parseInt(params.postId)} />
			</main>
		</div>
	);
}
