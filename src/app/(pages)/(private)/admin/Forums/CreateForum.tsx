import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BadgePlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function CreateForum() {
	const schema = z.object({
		title: z
			.string()
			.min(1, { message: "* Title must contain at least 1 characters" })
			.regex(/^[\x00-\xFF]*$/, { message: "* Title should contain only alphabets" })
			.max(25, { message: "* Title must contain a maximum of 25 characters" }),
		description: z
			.string()
			.min(1, { message: "* Description must contain at least 1 characters" })
			.regex(/^[\x00-\xFF]*$/, { message: "* Description should contain only alphabets" })
			.max(125, { message: "* Description must contain a maximum of 125 characters" }),
	});

	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(schema),
	});

	function handleCreateForum(data: any) {
		return toast.promise(
			axios
				.post("/api/admin/forums/createForum", {
					title: data.title,
					description: data.description,
				})
				.then((res) => {
					queryClient.fetchQuery({
						queryKey: ["list-forums"],
					});
				}),
			{
				loading: "Creating forum...",
				success: "Forum created successfully",
				error: "Error when creating",
			}
		);
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<BadgePlus />
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Thread</DialogTitle>
				</DialogHeader>
				<form className="flex flex-col gap-4" onSubmit={handleSubmit(handleCreateForum)} action="">
					<div className="flex flex-col gap-4">
						<Input {...register("title")} placeholder="Title" />
						{errors.title?.message && (
							<p className="my-1 text-[12px] text-red-500">{errors.title?.message as string}</p>
						)}
						<Input {...register("description")} placeholder="Description" />
						{errors.description?.message && (
							<p className="my-1 text-[12px] text-red-500">{errors.description?.message as string}</p>
						)}
					</div>
					<Button type="submit">Confirm</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
