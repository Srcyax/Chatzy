"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateThread } from "../Functions/CreateThread";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";

type ThreadProps = {
	id: number;
	title: string;
	description: string;
};

export default function Page({ params }: any) {
	const [threads, getThreads] = useState<ThreadProps[]>();
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

				<CreateThread forum={params.slug} />
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
											<AvatarFallback>A</AvatarFallback>
										</Avatar>
										<div className="flex flex-col">
											{thread.title}

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
	);
}
