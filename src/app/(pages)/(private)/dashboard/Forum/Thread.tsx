import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ReactNode } from "react";

type ThreadProps = {
	icon: ReactNode;
	id: number;
	title: string;
	description: string;
	username: string;
};

export function Thread(thread: ThreadProps) {
	return (
		<div className="flex justify-between w-full px-5 py-1">
			<div className="flex items-center gap-4">
				{thread.icon}

				<div>
					<Link
						className="font-semibold text-xl text-orange-400 hover:underline"
						href={`/forum/${thread.title}`}
					>
						{thread.title}
					</Link>
					<p className="text-[15px]">{thread.description}</p>
				</div>
			</div>
			<div className="flex gap-4 items-center">
				<Avatar className="cursor-pointer hover:border border-orange-400">
					<AvatarImage src="" alt="@shadcn" />
					<AvatarFallback>{thread.username.charAt(0).toUpperCase()}</AvatarFallback>
				</Avatar>
				<div className="flex flex-col">
					<h1 className="font-semibold">We accept payme...</h1>
					<p className="text-[15px] text-zinc-600">29 October 2023</p>
				</div>
			</div>
		</div>
	);
}
