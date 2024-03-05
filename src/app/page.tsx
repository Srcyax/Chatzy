"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
	const router = useRouter();
	return (
		<main className="flex flex-col gap-4 items-center justify-center m-48">
			<div className="text-center">
				<h1 className="text-5xl">
					Welcome to <strong className="font-bold text-orange-400">Chatzy</strong>
				</h1>
				<p className="leading-relaxed">Your Ultimate Chatting Destination</p>
			</div>
			<Button
				onClick={() => router.push("/dashboard")}
				className="flex gap-2 hover:gap-4 transition-all duration-200"
			>
				Let&apos;s chat
				<ArrowRight />
			</Button>
		</main>
	);
}
