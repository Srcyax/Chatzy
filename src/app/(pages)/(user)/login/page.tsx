"use client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

export default function Home() {
	const schema = z.object({
		username: z
			.string()
			.min(3, { message: "* User must contain at least 3 characters" })
			.regex(/^[\x00-\xFF]*$/, { message: "* User should contain only alphabets" })
			.max(10, { message: "* User must contain a maximum of 10 characters" }),
		password: z
			.string()
			.min(4, { message: "* Password must contain at least 4 characters" })
			.regex(/^[\x00-\xFF]*$/, { message: "* Password should contain only alphabets" })
			.max(24, { message: "* Password must contain a maximum of 24 characters" }),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(schema),
	});

	const router = useRouter();

	function onSubmit(data: any) {
		const validatedData = schema.parse(data);

		axios
			.post("api/user/login", {
				username: validatedData.username,
				password: validatedData.password,
			})
			.then(() => {
				router.push("/dashboard");
			})
			.catch((error) => {
				toast.error(error.response.data.error);
			});
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<Tabs defaultValue="login" className="w-[400px]">
				<TabsList className="grid w-full grid-cols-1">
					<TabsTrigger value="login">Log in</TabsTrigger>
				</TabsList>
				<TabsContent value="login">
					<Card>
						<CardHeader>
							<CardTitle>Account</CardTitle>
							<CardDescription>Please proceed with authentication to access your account.</CardDescription>
						</CardHeader>
						<form onSubmit={handleSubmit(onSubmit)} action="">
							<CardContent className="space-y-2">
								<div className="space-y-1">
									<Label htmlFor="name">Username</Label>
									<Input {...register("username")} id="username" />
									{errors.username?.message && (
										<p className="my-1 text-[12px] text-red-500">{errors.username?.message as string}</p>
									)}
								</div>
								<div className="space-y-1">
									<Label htmlFor="username">Password</Label>
									<Input {...register("password")} id="password" type="password" />
									{errors.password?.message && (
										<p className="my-1 text-[12px] text-red-500">{errors.password?.message as string}</p>
									)}
								</div>
							</CardContent>
							<CardFooter className="flex gap-4">
								<Button type="submit">Log in</Button>
								<h1>
									Don&apos;t have an account?{" "}
									<Link className="underline" href="/register">
										Register
									</Link>
								</h1>
							</CardFooter>
						</form>
					</Card>
				</TabsContent>
			</Tabs>
		</main>
	);
}
