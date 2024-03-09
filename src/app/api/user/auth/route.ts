import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "@/functions/prisma";

export async function GET() {
	const token = cookies().get("token");

	if (!token) {
		return NextResponse.json({ error: "Not allowed" }, { status: 401 });
	}

	try {
		const validateToken = jwt.verify(token.value, process.env.JWT_SECRET as string) as JwtPayload;

		if (!validateToken) {
			return NextResponse.json({ error: "Not allowed" }, { status: 401 });
		}

		const validateUser = await prisma.user.findUnique({
			where: {
				id: validateToken.id,
			},
		});

		if (!validateUser) {
			return NextResponse.json({ error: "Not allowed" }, { status: 401 });
		}

		const { password, ...user } = validateUser;

		return NextResponse.json({ user });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: error }, { status: 401 });
	}
}
