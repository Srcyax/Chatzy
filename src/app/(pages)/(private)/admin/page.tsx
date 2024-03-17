"use client";
import Header from "@/app/header";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import ListAllUsers from "./Users/ListAll";
import { useState } from "react";
import ListForums from "./Forums/ListForums";

export default function Admin() {
	const router = useRouter();

	const [tab, setTab] = useState<number>(0);

	const { data, isLoading, isError } = useQuery({
		queryKey: ["adminauth"],
		queryFn: async () => {
			return axios
				.get("/api/admin/auth")
				.then((res) => res.data)
				.catch(() => {
					return router.push("/dashboard");
				});
		},
	});

	if (isLoading) {
		return <></>;
	}

	if (isError) {
		return <></>;
	}

	const { id, username, role } = data.user;

	return (
		<div>
			<Header id={id} username={username} role={role} />
			<main className="m-10 flex gap-4">
				<div className="shadow-md border rounded-lg w-24 p-4 flex flex-col items-center gap-8">
					<li
						onClick={() => setTab(0)}
						className="list-none hover:text-orange-400 cursor-pointer font font-medium"
					>
						Users
					</li>
					<li
						onClick={() => setTab(1)}
						className="list-none hover:text-orange-400 cursor-pointer font font-medium"
					>
						Forums
					</li>
				</div>
				<div className="w-full shadow-md border rounded-lg py-10">
					{tab === 0 ? <ListAllUsers /> : <ListForums />}
				</div>
			</main>
		</div>
	);
}
