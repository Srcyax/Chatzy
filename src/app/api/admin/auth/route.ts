import { prisma } from "@/functions/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const token = cookies().get("token")?.value;

	if (!token) {
		return NextResponse.json({ error: "Not allowed" }, { status: 500 });
	}

	try {
		const validateToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

		if (!validateToken) {
			return NextResponse.json({ error: "Not allowed" }, { status: 500 });
		}

		const validateUser = await prisma.user.findUnique({
			where: {
				id: validateToken.id,
				role: "administrator",
			},
		});

		if (!validateUser) {
			return NextResponse.json({ error: "Not allowed" }, { status: 500 });
		}

		const { password, ...user } = validateUser;

		return NextResponse.json({ user });
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
