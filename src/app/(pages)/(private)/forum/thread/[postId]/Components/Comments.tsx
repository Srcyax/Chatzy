import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type ThreadComment = {
	id: number;
	text: string;
	author: string;
};

export function Comment({ id }: { id: number }) {
	const [comments, getThreadComments] = useState<ThreadComment[]>();
	const [submit, setSubmit] = useState<boolean>(false);
	const queryClient = useQueryClient();

	const schema = z.object({
		text: z
			.string()
			.min(1, { message: "* Comment must contain at least 1 character" })
			.regex(/^[\x00-\xFF]*$/, {
				message: "* Comment should contain only alphabets",
			})
			.max(125, {
				message: "* Comment must contain a maximum of 125 characters",
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

	const { data, isLoading } = useQuery({
		queryKey: ["get-thread-comments"],
		queryFn: () => {
			axios
				.post("/api/forum/thread/comments/getComments", {
					threadId: id,
				})
				.then((res) => {
					getThreadComments(res.data.comments);
				});

			return "";
		},
	});

	function handleComment(data: any) {
		setSubmit(true);

		return toast.promise(
			axios
				.post("/api/forum/thread/comments", {
					threadId: id,
					text: data.text,
				})
				.then(() => {
					queryClient.fetchQuery({ queryKey: ["get-thread-comments"] });
					setSubmit(false);
					reset();
				})
				.catch((error) => {
					setSubmit(false);
					reset();
				}),
			{
				loading: "Sending comment...",
				success: "Sent with success",
				error: "Error when sending",
			}
		);
	}

	return (
		<>
			<form onSubmit={handleSubmit(handleComment)} action="" className="flex gap-4">
				<div className="w-full h-full">
					<Input
						{...register("text")}
						disabled={submit || isLoading}
						className="resize-none"
						placeholder="Comment something..."
					/>
					{errors.text?.message && (
						<p className="my-1 text-[12px] text-red-500">{errors.text?.message as string}</p>
					)}
				</div>

				<Button disabled={submit || isLoading}>
					<Send width={20} />
				</Button>
			</form>

			<div className="flex flex-col gap-8">
				{isLoading ? (
					<div className="border p-5 rounded-lg shadow-lg">
						<div className="flex gap-4 items-center">
							<Skeleton className="w-16 h-16 rounded-full" />
							<Skeleton className="w-44 h-5 rounded-lg" />
						</div>
					</div>
				) : (
					<></>
				)}
				{comments?.toReversed().map((comment, index) => (
					<div key={index} className="border p-5 rounded-lg shadow-lg">
						<div className="flex gap-4 items-center">
							<Avatar className="shadow-xl w-16 h-16">
								<AvatarImage src="" />
								<AvatarFallback>{comment.author.charAt(0).toUpperCase()}</AvatarFallback>
							</Avatar>

							<h1>{comment.text}</h1>
						</div>
					</div>
				))}
			</div>
		</>
	);
}
