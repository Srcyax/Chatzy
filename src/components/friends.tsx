import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

type Friends = {
	id: number;
	username: string;
};

export function Friends() {
	const [friends, getFriends] = useState<Friends[]>([]);

	const { data, isLoading } = useQuery({
		queryKey: ["list-friends"],
		queryFn: async () => {
			return axios
				.get("/api/user/friendship/listall")
				.then((res) => {
					getFriends(res.data.friends);
					return res.data;
				})
				.catch((error) => {
					toast.error(error.response.data.error);
				});
		},
	});

	if (isLoading) {
		return <></>;
	}

	return (
		<>
			{friends.length ? friends.map((friend, index) => <h1 key={index}>{friend.username}</h1>) : null}
		</>
	);
}
