import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

type User = {
	username: string;
	role: string | null;
};

export default function Header({ username, role }: { username: string; role: string | null }) {
	const router = useRouter();

	return (
		<header className="flex justify-between items-center p-5 shadow-xl">
			<Link href="/" className="text-3xl font-bold">
				Chat<strong className="text-orange-400">zy</strong>
			</Link>

			<div className="flex gap-4">
				<Button variant="outline" onClick={() => router.push("/dashboard")}>
					Dashboard
				</Button>
				{role === "administrator" && (
					<Button variant="outline" onClick={() => router.push("/admin")}>
						Admin
					</Button>
				)}
				<Avatar>
					<AvatarImage src="" alt="@shadcn" />
					<AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
				</Avatar>
			</div>
		</header>
	);
}
