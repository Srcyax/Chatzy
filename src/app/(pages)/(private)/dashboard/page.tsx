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
import { Button } from "@/components/ui/button";
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
				</div>
			</main>
		</div>
	);
}
