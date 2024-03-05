import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function POST(req: NextRequest) {
	const body = await req.json();

	const { id } = body;

	const prisma = new PrismaClient();

	try {
		const userProfile = await prisma.user.findUnique({
			where: {
				id: id,
			},
		});

		const token = cookies().get("token");

		if (!token) {
			return NextResponse.json({ userProfile, isLocalUser: false });
		}

		const { idLocal } = jwt.verify(
			token.value,
			process.env.JWT_SECRET as string
		) as JwtPayload;

		return NextResponse.json({ userProfile, isLocalUser: true });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: error }, { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
}
