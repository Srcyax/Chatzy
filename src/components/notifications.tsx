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

type Notifications = {
	id: number;
	title: string;
	userId: number;
};

export function Notification() {
	const [notifications, getNotifications] = useState<Notifications[]>([]);

	const { data, isLoading } = useQuery({
		queryKey: ["list-friend"],
		queryFn: async () => {
			return axios
				.get("/api/notifications/listall")
				.then((res) => {
					getNotifications(res.data.notifications);
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
				{notifications.length ? (
					notifications.map((notification, index) => (
						<div key={index} className="h-10 flex gap-4 items-center border rounded-sm px-5">
							<Contact />
							<h1 className="py-2 text-[12px]">{notification.title}</h1>
							<div className="flex gap-2">
								<Check
									onClick={async () => {
										axios
											.post("/api/user/friendship/accept", {
												id: notification.userId,
												notiId: notification.id,
											})
											.then((res) => {
												queryClient.fetchQuery({
													queryKey: ["list-friend"],
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
				{notifications.length ? (
					<h1 className="text-center underline">read all notifications</h1>
				) : null}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
