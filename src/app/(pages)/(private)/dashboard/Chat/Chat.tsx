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
import { toast } from "sonner";

type Comments = {
	id: number;
	text: string;
	authorId: number;
	author: {
		username: string;
		role: string;
		about: string;
	};
	at: any;
	edited: boolean;
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
	const [submit, setSubmit] = useState<boolean>(false);

	const queryClient = useQueryClient();

	const { isLoading } = useQuery({
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
		setSubmit(true);
		return toast.promise(
			axios
				.post("/api/user/comment", {
					comment: data.message,
				})
				.then(() => {
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
							setSubmit(false);
						});
				})
				.catch((error) => {
					toast.error(error.response.data.error);
					setSubmit(false);
					reset();
				}),
			{
				loading: "Sending comment...",
				error: "Error when sending",
			}
		);
	}

	useMutation({
		mutationKey: ["commentsmutate"],
		mutationFn: PostMessage,
	});

	const banned = role === "banned";

	return (
		<div className="flex flex-col gap-4 w-full ">
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

				<Button disabled={submit || isLoading || banned}>
					<Send width={20} />
				</Button>
			</form>
		</div>
	);
}
