"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChatBoard } from "./Chat/Chat";
import Link from "next/link";

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

	const { username, about } = data?.user;

	return (
		<div>
			<header className="flex justify-between items-center p-5 shadow-xl">
				<Link href="/" className="text-3xl font-bold">
					Chat<strong className="text-orange-400">zy</strong>
				</Link>
				<Avatar>
					<AvatarImage src="" alt="@shadcn" />
					<AvatarFallback className="text-[20px]">
						{username.charAt(0)}
					</AvatarFallback>
				</Avatar>
			</header>
			<main className="m-10">
				<div className="flex flex-col gap-4 w-1/2">
					<ChatBoard />
				</div>
			</main>
		</div>
	);
}
