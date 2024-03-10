import { Trash2 } from "lucide-react";

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
import { toast } from "sonner";

export function DeleteComment({ id }: { id: number }) {
	function handleDelete() {
		return toast.promise(
			axios.post("/api/user/comment/delete", {
				id: id,
			}),
			{
				loading: "Deleting...",
				success: "Successfully deleted",
				error: "Error when deleting",
			}
		);
	}

	return (
		<>
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Trash2 className="cursor-pointer hover:text-orange-400" width={13} />
				</AlertDialogTrigger>
				<AlertDialogContent>
					<form className="flex flex-col gap-4" onSubmit={handleDelete} action="">
						<AlertDialogHeader>
							<AlertDialogTitle>Delete</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete your comment and remove your data
								from our servers.
							</AlertDialogDescription>
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
