import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

type User = {
	id: number;
	username: string;
	about: string;
};

export async function GenerateAuthToken(user: User) {
	const token = jwt.sign(
		{ username: user.username, id: user.id, about: user.about },
		process.env.JWT_SECRET as string,
		{
			expiresIn: "2h",
		}
	);

	return cookies().set("token", token, {
		maxAge: 60 * 120,
		secure: false,
		httpOnly: true,
	});
}
