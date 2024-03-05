import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";

type Comments = {
	id: number;
	comment: string;
	authorId: number;
	author: string;
};

export default function ChatBody({
	comments,
}: {
	comments: Comments[] | undefined;
}) {
	const router = useRouter();
	return (
		<ScrollArea className="h-72 rounded-md border shadow-inner">
			<div className="p-4">
				{comments &&
					comments?.map((chat, index) => (
						<div key={index} className="my-4">
							<div className="flex gap-2 items-center">
								<Avatar>
									<AvatarImage src="" alt="@shadcn" />
									<AvatarFallback className="text-[20px] bg-orange-200">
										{chat.author.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div className="flex flex-col justify-center">
									<HoverCard>
										<HoverCardTrigger asChild>
											<h1
												onClick={() => {
													router.push(
														`/user/profile/${chat.authorId}`
													);
												}}
												className="text-[15px] font-medium hover:underline hover:cursor-pointer"
											>
												{chat.author}
											</h1>
										</HoverCardTrigger>
										<HoverCardContent className="w-60">
											<div className="flex items-center space-x-4">
												<Avatar>
													<AvatarImage
														src=""
														alt="@shadcn"
													/>
													<AvatarFallback className="text-[20px] bg-orange-200">
														{chat.author.charAt(0)}
													</AvatarFallback>
												</Avatar>
												<div className="overflow-hidden h-14">
													<h1 className="text-[15px] font-medium">
														{chat.author}
													</h1>
													<p className="truncate">
														{chat.author}
													</p>
												</div>
											</div>
										</HoverCardContent>
									</HoverCard>

									<h1 className="text-[13px] text-zinc-700">
										{chat.comment}
									</h1>
								</div>
							</div>
						</div>
					))}
			</div>
		</ScrollArea>
	);
}
