import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Check, Contact, X } from "lucide-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { Notification } from "@/components/notifications";
import { Friends } from "@/components/friends";

type Notification = {
	username: string;
	role: string | null;
};

export default function Header({
	id,
	username,
	role,
}: {
	id: number;
	username: string;
	role: string | null;
}) {
	const router = useRouter();

	return (
		<header className="flex justify-between items-center p-5 shadow-xl">
			<Link href="/" className="text-3xl font-bold">
				Chat<strong className="text-orange-400">zy</strong>
			</Link>
			<Friends />
			<div className="flex gap-4">
				<Button variant="outline" onClick={() => router.push("/dashboard")}>
					Dashboard
				</Button>
				{role === "administrator" && (
					<Button variant="outline" onClick={() => router.push("/admin")}>
						Admin
					</Button>
				)}

				<Notification />

				<DropdownMenu>
					<DropdownMenuTrigger>
						<Avatar>
							<AvatarImage src="" alt="@shadcn" />
							<AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => {
								router.push(`/user/profile/${id}`);
							}}
						>
							Profile
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => {
								axios.get("/api/user/logout").then(() => location.reload());
							}}
						>
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
