import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axios from "axios";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ChatBody from "./ChatBody";

type Comments = {
	id: number;
	text: string;
	authorId: number;
	author: {
		username: string;
		role: string;
		about: string;
	};
};

export function ChatBoard({ role }: { role: string | null }) {
	const schema = z.object({
		message: z
			.string()
			.min(1, { message: "* Message must contain at least 1 character" })
			.regex(/^[\x00-\xFF]*$/, {
				message: "* Message should contain only alphabets",
			})
			.max(125, {
				message: "* Message must contain a maximum of 125 characters",
			}),
	});

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(schema),
	});

	const [comments, getComments] = useState<Comments[]>();

	const queryClient = useQueryClient();
	const router = useRouter();

	const { data, isError, isLoading, isRefetching } = useQuery({
		queryKey: ["comments"],
		queryFn: async () => {
			await axios.get("/api/user/comment").then((res) => {
				getComments(res.data.comments);
				queryClient.fetchQuery({
					queryKey: ["comments-scroll"],
				});
			});

			return "";
		},
		refetchInterval: 5000,
	});

	async function PostMessage(data: any) {
		return axios
			.post("/api/user/comment", {
				comment: data.message,
			})
			.then((response) => {
				queryClient
					.fetchQuery({
						queryKey: ["comments"],
					})
					.then(() => {
						reset();
						setTimeout(() => {
							queryClient.fetchQuery({
								queryKey: ["comments-scroll"],
							});
						}, 500);
					});
			})
			.catch((error) => {
				reset();
			});
	}

	const { mutate } = useMutation({
		mutationKey: ["commentsmutate"],
		mutationFn: PostMessage,
	});

	const banned = role === "banned";

	return (
		<>
			<ChatBody comments={comments} />

			<form className="flex gap-4" onSubmit={handleSubmit(PostMessage)} action="">
				<div className="w-full">
					<Input
						disabled={isLoading || banned}
						{...register("message")}
						className="shadow-xl"
						type="text"
						id="chatinput"
						autoComplete="off"
						maxLength={125}
						placeholder={`${!banned ? "Type something..." : "You have been banned from Chatzy."}`}
					/>
					{errors.message?.message && (
						<p className="my-1 text-[12px] text-red-500">{errors.message?.message as string}</p>
					)}
				</div>

				<Button disabled={isLoading || banned}>
					<Send width={20} />
				</Button>
			</form>
		</>
	);
}
