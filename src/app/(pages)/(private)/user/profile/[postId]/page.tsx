"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Undo2 } from "lucide-react";
export default function Page({ params }: any) {
	const router = useRouter();

	const { data, isLoading, isError } = useQuery({
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
						{isLoading ? (
							<Skeleton className="w-20 h-20 rounded-full" />
						) : (
							<Avatar className="shadow-xl w-20 h-20">
								<AvatarImage src="" />
								<AvatarFallback className="text-2xl">
									{data?.userProfile.username.charAt(0)}
								</AvatarFallback>
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
									<h1>{data?.userProfile?.username}</h1>
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
							{isLoading ? (
								<div className="flex flex-col gap-2">
									<Skeleton className="w-96 smartphone:w-48 h-4" />
									<Skeleton className="w-72 smartphone:w-40 h-4" />
								</div>
							) : (
								<div>
									<h1>{data?.userProfile?.about}</h1>
								</div>
							)}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
