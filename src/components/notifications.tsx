import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Bell, Check, Contact, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Requests = {
	id: number;
	requester: string;
	userId: number;
};

export function Notification() {
	const [requests, getRequests] = useState<Requests[]>([]);

	const { data, isLoading } = useQuery({
		queryKey: ["list-friendrequest"],
		queryFn: async () => {
			return axios
				.get("/api/user/friendship/requests")
				.then((res) => {
					getRequests(res.data.requests);
					return res.data;
				})
				.catch((error) => {
					toast.error(error.response.data.error);
				});
		},
	});

	const queryClient = useQueryClient();

	if (isLoading) {
		return <></>;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Bell />
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>Notifications</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{requests.length ? (
					requests.map((request, index) => (
						<div key={index} className="h-10 flex gap-4 items-center border rounded-sm px-5">
							<Contact />
							<h1 className="py-2 text-[12px]">
								<strong>{request.requester}</strong> wants to be your friend
							</h1>
							<div className="flex gap-2">
								<Check
									onClick={async () => {
										axios
											.post("/api/user/friendship/accept", {
												id: request.userId,
												notiId: request.id,
											})
											.then((res) => {
												queryClient.fetchQuery({
													queryKey: ["list-friendrequest"],
												});
											})
											.catch((error) => {});
									}}
									className="bg-green-500 rounded-md cursor-pointer"
								/>
								<X className="bg-red-500 rounded-md cursor-pointer" />
							</div>
						</div>
					))
				) : (
					<h1>There are no notifications</h1>
				)}

				<DropdownMenuSeparator />
				{requests.length ? <h1 className="text-center underline">read all notifications</h1> : null}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
