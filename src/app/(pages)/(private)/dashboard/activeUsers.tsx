import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
	id: number;
	username: string;
};

export function ActiveUsers() {
	const [users, getUsers] = useState<User[]>([]);

	const queryClient = useQueryClient();
	const router = useRouter();

	const { data, isLoading, isError, isFetching } = useQuery({
		queryKey: ["activeusers"],
		queryFn: async () => {
			await axios.post("/api/ping").then(() => {
				axios.get("/api/ping").then(async (res) => getUsers(res.data.users));
			});

			return "";
		},
	});

	async function UpdateUsers() {
		await axios
			.post("/api/ping/update")
			.then((response) => {
				queryClient.fetchQuery({
					queryKey: ["activeusers"],
				});
			})
			.catch((error) => {});
	}

	useEffect(() => {
		if (!data) return;
		setTimeout(() => {
			if (isFetching || isLoading) {
				return;
			}

			UpdateUsers();
		}, 5000); // 5 segundos
	}, [isFetching]);

	const { mutate } = useMutation({
		mutationKey: ["updateactiveusers"],
		mutationFn: UpdateUsers,
	});

	return (
		<div className="grid grid-cols-4 gap-2 p-1 h-56 overflow-y-auto overflow-hidden">
			{users.length ? (
				users.map((user, index) => (
					<div key={index}>
						<Avatar
							onClick={() => router.push(`/user/profile/${user.id}`)}
							className="cursor-pointer shadow-md hover:border border-orange-400"
						>
							<AvatarImage src="" alt="@shadcn" />
							<AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
						</Avatar>
						<h1 className="text-center text-[13px]">{user.username}</h1>
					</div>
				))
			) : isFetching ? (
				<div>
					<Skeleton className="w-10 h-10 rounded-full" />
				</div>
			) : null}
		</div>
	);
}
