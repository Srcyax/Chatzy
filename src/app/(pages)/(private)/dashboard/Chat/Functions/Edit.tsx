import { Edit } from "lucide-react";
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
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function EditComment({ id }: { id: number }) {
	const schema = z.object({
		comment: z
			.string()
			.min(1, { message: "* Comment must contain at least 1 characters" })
			.regex(/^[\x00-\xFF]*$/, { message: "* Comment should contain only alphabets" })
			.max(125, { message: "* Comment must contain a maximum of 125 characters" }),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(schema),
	});

	function handleEdit(data: any) {
		toast.promise(
			axios.post("/api/user/comment/edit", {
				comment: data.comment,
				id: id,
			}),
			{
				loading: "Sending modification...",
				success: "Sent with success",
				error: "Error when sending",
			}
		);
	}

	return (
		<>
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Edit className="cursor-pointer hover:text-orange-400" width={13} />
				</AlertDialogTrigger>
				<AlertDialogContent>
					<form className="flex flex-col gap-4" onSubmit={handleSubmit(handleEdit)} action="">
						<AlertDialogHeader>
							<AlertDialogTitle>Edit</AlertDialogTitle>
							<div>
								<Input {...register("comment")} placeholder="Type something..." />
								{errors.comment?.message && (
									<p className="my-1 text-[12px] text-red-500">{errors.comment?.message as string}</p>
								)}
							</div>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel type="reset">Cancel</AlertDialogCancel>
							<AlertDialogAction type="submit">Continue</AlertDialogAction>
						</AlertDialogFooter>
					</form>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
