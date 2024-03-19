"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BadgePlus, Undo2 } from "lucide-react";
import { CreateThread } from "../Functions/CreateThread";

type ThreadProps = {
	id: number;
	title: string;
	description: string;
	author: string;
};

export default function Page({ params }: any) {
	const [threads, getThreads] = useState<ThreadProps[]>();
	const [createThread, setCreateThread] = useState<boolean>(false);
	const router = useRouter();

	const { data, isLoading, isError, error } = useQuery({
		queryKey: [`list-${params.slug}-threads`],
		queryFn: async () => {
			return axios
				.post("/api/forum/listThread", {
					title: params.slug,
				})
				.then((res) => getThreads(res.data.threads));
		},
	});

	return (
		<>
			{!createThread ? (
				<main className="m-20 flex flex-col gap-4">
					<div className="flex justify-between">
						<div className="flex gap-4">
							<Button
								className="h-9"
								onClick={() => {
									router.push("/dashboard");
								}}
							>
								<Undo2 />
							</Button>
							<h1 className="text-3xl font-semibold">{params.slug}</h1>
						</div>
						<Button onClick={() => setCreateThread(true)}>
							<BadgePlus />
						</Button>
					</div>

					<div className="flex flex-col gap-4 w-full p-5 border shadow-lg rounded-md">
						{isLoading ? (
							<>
								<div className="flex gap-4 w-full py-5 px-2 rounded-lg shadow-sm ">
									<Skeleton className="w-10 h-10 rounded-full" />
									<div className="flex flex-col gap-2">
										<Skeleton className="w-10 h-4 rounded-sm" />
										<Skeleton className="w-16 h-4 rounded-sm" />
									</div>
								</div>
							</>
						) : (
							<>
								{threads?.toReversed().map((thread, index) => (
									<Link
										key={index}
										className="hover:border border-orange-400 rounded-lg"
										href={`/forum/thread/${thread.id}`}
									>
										<div className="flex w-full py-5 px-2 rounded-lg shadow-sm">
											<div className="flex items-center gap-4">
												<Avatar className="cursor-pointer hover:border border-orange-400">
													<AvatarImage src="" alt="@shadcn" />
													<AvatarFallback>{thread.author.charAt(0).toUpperCase()}</AvatarFallback>
												</Avatar>
												<div className="flex flex-col">
													<h1 className="font-bold text-xl">{thread.title}</h1>

													<p className="text-[15px]">{thread.description}</p>
												</div>
											</div>
										</div>
									</Link>
								))}
							</>
						)}
					</div>
				</main>
			) : (
				<CreateThread forum={params.slug} />
			)}
		</>
	);
}
