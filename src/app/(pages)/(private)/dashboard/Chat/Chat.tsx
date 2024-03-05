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
	comment: string;
	authorId: number;
	author: string;
};

export function ChatBoard() {
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

	const { data } = useQuery({
		queryKey: ["comments"],
		queryFn: async () => {
			return axios.get("/api/user/comment").then((res) => {
				getComments(res.data.comments);
			});
		},
	});

	function PostMessage(data: any) {
		console.log(data);
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
					});
			})
			.catch((error) => {});
	}

	const { mutate } = useMutation({
		mutationKey: ["commentsmutate"],
		mutationFn: PostMessage,
	});

	return (
		<>
			<ChatBody comments={comments} />

			<form
				className="flex gap-4"
				onSubmit={handleSubmit(PostMessage)}
				action=""
			>
				<div className="w-full">
					<Input
						{...register("message")}
						className="shadow-xl"
						type="text"
						id="chatinput"
						autoComplete="off"
						maxLength={125}
						placeholder="Type something..."
					/>
					{errors.message?.message && (
						<p className="my-1 text-[12px] text-red-500">
							{errors.message?.message as string}
						</p>
					)}
				</div>

				<Button>
					<Send width={20} />
				</Button>
			</form>
		</>
	);
}
