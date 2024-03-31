import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AddFriend({ id }: { id: number }) {
	async function Add() {
		toast.promise(
			axios
				.post("/api/notifications/friend_request", {
					id: id,
				})
				.then((res) => {
					toast(res.data.message);
					return res.data;
				})
				.catch((error) => {
					toast.error(error.response.data.error);
				}),
			{
				loading: "Sending modifications...",
			}
		);
	}

	return (
		<Button
			onClick={async () => {
				await Add();
			}}
			variant={"ghost"}
		>
			<UserPlus />
		</Button>
	);
}
