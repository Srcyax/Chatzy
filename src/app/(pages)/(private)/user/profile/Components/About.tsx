import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ArrowUpRight, Edit } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function About({
	isLoading,
	isOwner,
	about,
}: {
	isLoading: boolean;
	isOwner: boolean;
	about: string;
}) {
	const [edit, setEdit] = useState<boolean>(false);

	const schema = z.object({
		about: z
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

	const queryClient = useQueryClient();

	async function EditAbout(data: any) {
		return axios
			.post("/api/user/profile/about", {
				about: data.about,
			})
			.then((res) => {
				queryClient.fetchQuery({
					queryKey: ["user-profile"],
				});
				toast(res.data.message);
				setEdit(false);
			})
			.catch((error) => {
				toast.error(error.response.data.error);
				setEdit(false);
			});
	}

	const { mutate } = useMutation({
		mutationKey: ["about-mutate"],
		mutationFn: EditAbout,
	});

	return (
		<div className="flex flex-col gap-2 items-center justify-center w-full border-2 shadow-3xl p-5 rounded-md">
			<div className="w-full h-full">
				{isLoading ? (
					<div className="flex flex-col gap-2">
						<Skeleton className="w-96 smartphone:w-48 h-4" />
						<Skeleton className="w-72 smartphone:w-40 h-4" />
					</div>
				) : (
					<div>
						<div className="flex gap-4">
							<h1>{!edit && about}</h1>
							{isOwner && !edit && <Edit className="cursor-pointer" onClick={() => setEdit(true)} />}
						</div>

						{edit && (
							<form onSubmit={handleSubmit(EditAbout)}>
								<Textarea {...register("about")} className="resize-none" defaultValue={about} />
								{errors.about?.message && (
									<p className="my-1 text-[12px] text-red-500">{errors.about?.message as string}</p>
								)}
								<div className="flex gap-4 my-4">
									<Button type="submit">
										<ArrowUpRight />
									</Button>
									<Button
										onClick={() => {
											setEdit(false);
											reset();
										}}
										type="reset"
									>
										Cancel
									</Button>
								</div>
							</form>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
