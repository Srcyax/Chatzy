"use client";
import Header from "@/app/header";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import ListAllUsers from "./Users/ListAll";

export default function Admin() {
	const router = useRouter();

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
		return (
			<>
				<h1>Cu</h1>
			</>
		);
	}

	if (isError) {
		return (
			<>
				<h1>Cuerror</h1>
			</>
		);
	}

	const { username, role } = data.user;

	return (
		<div>
			<Header username={username} role={role} />
			<main className="m-10 flex gap-4">
				<div className="shadow-md border rounded-lg w-24 p-4 flex flex-col items-center gap-8">
					<li className="list-none hover:text-orange-400 cursor-pointer font font-medium">Users</li>
				</div>
				<div className="w-full shadow-md border rounded-lg py-10">
					<ListAllUsers />
				</div>
			</main>
		</div>
	);
}
