import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function POST(req: NextRequest) {
	const body = await req.json();
	const { about } = body;

	const prisma = new PrismaClient();

	const token = cookies().get("token");

	if (!token) {
		return NextResponse.json({ error: "Not allowed" }, { status: 401 });
	}

	try {
		const user = jwt.decode(token.value) as JwtPayload;

		if (!user) {
			return NextResponse.json({ error: "Not allowed" }, { status: 401 });
		}

		await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				about: about,
			},
		});

		return NextResponse.json({ message: "About me edited successfully" });
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
}
