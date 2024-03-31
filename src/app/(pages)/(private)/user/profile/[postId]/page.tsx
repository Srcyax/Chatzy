"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Undo2, UserPlus } from "lucide-react";
import { About } from "../Components/About";
import { AddFriend } from "../Components/AddFriend";

export default function Page({ params }: any) {
	const router = useRouter();

	const { data, isLoading, isError, isRefetching } = useQuery({
		queryKey: ["user-profile"],
		queryFn: async () => {
			return axios
				.post("/api/user/profile", {
					id: parseInt(params.postId),
				})
				.then((res) => res.data)
				.catch(() => {
					return router.push("/dashboard");
				});
		},
	});

	if (isError) {
		router.push("/dashboard");
		return;
	}

	return (
		<div>
			<main className="m-16 flex flex-col gap-5">
				<div>
					<Button
						className="h-9"
						onClick={() => {
							router.push("/dashboard");
						}}
					>
						<Undo2 />
					</Button>
				</div>
				<div className="flex laptop:flex-row tablet:flex-col smartphone:flex-col gap-2 smartphone:gap-4 w-full">
					<div className="flex flex-col gap-2 items-center justify-start border-2 shadow-3xl px-16 py-5 h-64 rounded-md">
						{isLoading || isRefetching ? (
							<Skeleton className="w-20 h-20 rounded-full" />
						) : (
							<Avatar className="shadow-xl w-20 h-20">
								<AvatarImage src="" />
								<AvatarFallback>{data?.userProfile.username.charAt(0).toUpperCase()}</AvatarFallback>
							</Avatar>
						)}
						<div className="flex flex-col gap-2 items-center">
							{isLoading || isRefetching ? (
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
									{!data?.isOwner && data?.userProfile.role !== "banned" && (
										<AddFriend id={data?.userProfile?.id} />
									)}
								</div>
							)}
						</div>
					</div>
					<About
						isLoading={isLoading || isRefetching}
						isOwner={data?.isOwner}
						about={data?.userProfile?.about}
					/>
				</div>
			</main>
		</div>
	);
}
