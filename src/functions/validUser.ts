import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "./prisma";

export async function ValidUser() {
	const token = cookies().get("token")?.value as string;

	if (!token) {
		return false;
	}

	const user = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

	if (!user) {
		return false;
	}

	if (!user.id) {
		return false;
	}

	const userValidate = await prisma.user.findUnique({
		where: {
			id: user.id,
		},
	});

	if (!userValidate) {
		return false;
	}

	if (userValidate?.role === "banned") {
		return false;
	}

	return true;
}
