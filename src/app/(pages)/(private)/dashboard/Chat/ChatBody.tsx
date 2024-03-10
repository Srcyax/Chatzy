import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { EditComment } from "./Functions/Edit";
import { DeleteComment } from "./Functions/Delete";

type Comments = {
	id: number;
	text: string;
	authorId: number;
	author: {
		username: string;
		role: string;
		about: string;
	};
	edited: boolean;
};

export default function ChatBody({ comments }: { comments: Comments[] | undefined }) {
	const router = useRouter();
	const [id, setId] = useState<number | null>(-1);
	const scrollRef = useRef<HTMLDivElement>(null);

	useQuery({
		queryKey: ["comments-scroll"],
		queryFn: async () => {
			const scrollArea = scrollRef.current;
			if (scrollArea) {
				const scrollInterval = setInterval(() => {
					scrollArea.scrollTop += 5;
					if (scrollArea.scrollTop + scrollArea.clientHeight === scrollArea.scrollHeight) {
						clearInterval(scrollInterval);
					}
				}, 1);

				return () => clearInterval(scrollInterval);
			}

			return "";
		},
	});

	useEffect(() => {
		axios.get("/api/user/auth").then((res) => setId(res.data.user.id));
	}, []);

	return (
		<div ref={scrollRef} className="h-72 rounded-md border shadow-inner overflow-auto">
			<div className="p-4">
				{comments ? (
					comments?.map((chat, index) => (
						<div key={index} className="my-4">
							<div className="flex gap-2 items-center">
								<Avatar>
									<AvatarImage src="" alt="@shadcn" />
									<AvatarFallback className=" bg-orange-200">
										{chat.author.username.charAt(0).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div className="flex flex-col justify-centerw-96">
									<HoverCard>
										<HoverCardTrigger asChild>
											<div className="flex gap-1 items-center">
												<h1
													onClick={() => {
														router.push(`/user/profile/${chat.authorId}`);
													}}
													className={`text-[15px] font-medium hover:cursor-pointer ${
														chat.author.role === "banned" ? "line-through" : "hover:underline"
													}`}
												>
													{chat.author.username}
												</h1>
												{chat.edited ? <h1 className="text-[10px] italic">edited</h1> : null}
											</div>
										</HoverCardTrigger>
										<HoverCardContent className="w-60">
											<div className="flex items-center space-x-4">
												<Avatar>
													<AvatarImage src="" alt="@shadcn" />
													<AvatarFallback className="text-[20px] bg-orange-200">
														{chat.author.username.charAt(0)}
													</AvatarFallback>
												</Avatar>
												<div className="overflow-hidden h-14">
													<h1 className="text-[15px] font-medium">{chat.author.username}</h1>
													<p className="truncate">{chat.author.about}</p>
												</div>
											</div>
										</HoverCardContent>
									</HoverCard>
									<div className="group flex gap-2 items-center">
										<div>
											<h1 className="text-[13px] text-zinc-700 break-all">{chat.text}</h1>
										</div>
										{id === chat.authorId && (
											<div className="flex gap-1 invisible group-hover:visible">
												<EditComment id={chat.id} />
												<DeleteComment id={chat.id} />
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					))
				) : (
					<div className="my-4 flex gap-2 items-center">
						<Skeleton className="w-10 h-10 rounded-full" />
						<div className="flex flex-col gap-2">
							<Skeleton className="w-8 h-3 rounded-sm" />
							<Skeleton className="w-14 h-3 rounded-sm" />
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
