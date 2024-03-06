"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChatBoard } from "./Chat/Chat";
import Link from "next/link";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useEffect, useState } from "react";
import { ActiveUsers } from "./activeUsers";

type User = {
	id: number;
	username: string;
};

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
	});

	if (isLoading) {
		return <></>;
	}

	if (isError) {
		return <></>;
	}

	const { username } = data;

	return (
		<div>
			<header className="flex justify-between items-center p-5 shadow-xl">
				<Link href="/" className="text-3xl font-bold">
					Chat<strong className="text-orange-400">zy</strong>
				</Link>
				<Avatar>
					<AvatarImage src="" alt="@shadcn" />
					<AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
				</Avatar>
			</header>
			<main className="m-10 flex gap-12 laptop:flex-row tablet:flex-col smartphone:flex-col">
				<div className="flex flex-col gap-4 w-full ">
					<ChatBoard />
				</div>
				<div className="shadow-xl border p-4 rounded-md laptop:w-96 tablet:w-full smartphone:w-full">
					<div className="flex flex-col items-center gap-4 rounded-md p-5">
						<h1 className="text-center">
							<strong className="text-green-400">Online</strong>
						</h1>
						<ActiveUsers />
					</div>
				</div>
			</main>
		</div>
	);
}
