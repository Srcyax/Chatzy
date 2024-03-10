"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChatBoard } from "./Chat/Chat";
import { ActiveUsers } from "./activeUsers";
import Header from "@/app/header";

export default function Dashboard() {
	const router = useRouter();

	const { data, isLoading, isError } = useQuery({
		queryKey: ["authentication"],
		queryFn: async () => {
			return axios
				.get("/api/user/auth")
				.then((res) => res.data)
				.catch(() => {
					return router.push("/login");
				});
		},
		refetchInterval: 5000,
	});

	if (isLoading) {
		return <></>;
	}

	if (isError) {
		return <></>;
	}

	const { username, role } = data?.user;

	return (
		<div>
			<Header username={username} role={role} />
			<main>
				<div className="m-10 flex gap-12 laptop:flex-row tablet:flex-col smartphone:flex-col">
					<ChatBoard role={role} />
					<ActiveUsers />
				</div>
				<div className="m-10 flex gap-12 laptop:flex-row tablet:flex-col smartphone:flex-col">
					<div className="w-full h-96 p-5 border shadow-lg rounded-md">
						<h1>Hello</h1>
					</div>
					<div className="laptop:w-96 tablet:w-full smartphone:w-full p-5 border shadow-lg rounded-md">
						<h1>Hello</h1>
					</div>
				</div>
			</main>
		</div>
	);
}
