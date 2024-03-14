"use client";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BadgePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function CreateThread({ forum }: { forum: string }) {
	const schema = z.object({
		title: z
			.string()
			.min(1, { message: "* Title must contain at least 1 characters" })
			.regex(/^[\x00-\xFF]*$/, { message: "* Title should contain only alphabets" })
			.max(25, { message: "* Title must contain a maximum of 25 characters" }),
		description: z
			.string()
			.min(1, { message: "* Description must contain at least 1 characters" })
			.regex(/^[\x00-\xFF]*$/, { message: "* Description should contain only alphabets" })
			.max(125, { message: "* Description must contain a maximum of 125 characters" }),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(schema),
	});

	const queryClient = useQueryClient();
	const router = useRouter();

	const { data, isLoading } = useQuery({
		queryKey: ["get-owner-thread-profile"],
		queryFn: async () => {
			return axios
				.get("/api/forum/createThread/profile")
				.then((res) => res.data)
				.catch(() => {
					return router.push("/dashboard");
				});
		},
	});

	function handleCreateThread(data: any) {
		return axios
			.post("/api/forum/createThread", {
				forum: forum,
				title: data.title,
				description: data.description,
			})
			.then((res) => {
				queryClient
					.fetchQuery({
						queryKey: [`list-${forum}-threads`],
					})
					.then(() => {
						router.push(`/forum/thread/${res.data.thread.id}`);
					});
			});
	}

	useMutation({
		mutationKey: ["create-thread"],
		mutationFn: handleCreateThread,
	});

	return (
		<div>
			<main className="m-16 flex flex-col gap-5">
				<div className="flex laptop:flex-row tablet:flex-col smartphone:flex-col gap-2 smartphone:gap-4 w-full">
					<div className="flex flex-col gap-2 items-center justify-start border-2 shadow-3xl px-16 py-5 rounded-md">
						{isLoading ? (
							<Skeleton className="w-20 h-20 rounded-full" />
						) : (
							<Avatar className="shadow-xl w-20 h-20">
								<AvatarImage src="" />
								<AvatarFallback>{data?.userProfile.username.charAt(0).toUpperCase()}</AvatarFallback>
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
									<h1 className={`${data?.userProfile.role === "banned" ? "line-through" : ""}`}>
										{data?.userProfile?.username}
									</h1>
									<div className="px-5 bg-zinc-800 text-white rounded-sm">
										<h1>{data?.userProfile.role}</h1>
									</div>
									<h1>id: {data?.userProfile?.id}</h1>
								</div>
							)}
						</div>
					</div>
					<div className="flex flex-col gap-2 items-center justify-center w-full border-2 shadow-3xl p-5 rounded-md">
						<div className="w-full h-full">
							<div className="flex flex-col gap-2">
								<form className="flex flex-col gap-4" onSubmit={handleSubmit(handleCreateThread)} action="">
									<div className="flex flex-col gap-4">
										<div>
											<Input {...register("title")} placeholder="Title" />
											{errors.title?.message && (
												<p className="my-1 text-[12px] text-red-500">{errors.title?.message as string}</p>
											)}
										</div>

										<div>
											<Textarea
												className="h-28 resize-none"
												{...register("description")}
												placeholder="Description"
											/>
											{errors.description?.message && (
												<p className="my-1 text-[12px] text-red-500">{errors.description?.message as string}</p>
											)}
										</div>
									</div>
									<Button type="submit">Create</Button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
