import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { BadgePlus } from "lucide-react";
import { useForm } from "react-hook-form";
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

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(schema),
	});

	function handleCreateForum(data: any) {
		return axios
			.post("/api/forum/createForum", {
				title: data.title,
				description: data.description,
			})
			.then((res) => res.data);
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button>
					<BadgePlus />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<form className="flex flex-col gap-4" onSubmit={handleSubmit(handleCreateForum)} action="">
					<AlertDialogHeader>
						<AlertDialogTitle>Thread</AlertDialogTitle>
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
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel type="reset">Cancel</AlertDialogCancel>
						<AlertDialogAction type="submit">Create</AlertDialogAction>
					</AlertDialogFooter>
				</form>
			</AlertDialogContent>
		</AlertDialog>
	);
}
