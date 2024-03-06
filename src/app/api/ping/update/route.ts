import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

export async function POST(req: NextRequest) {
	const token = cookies().get("token");
	const prisma = new PrismaClient();

	if (!token) {
		return NextResponse.json({});
	}

	try {
		const user = jwt.verify(token.value, process.env.JWT_SECRET as string) as JwtPayload;

		if (!user) {
			return NextResponse.json({});
		}

		await prisma.activeUsers.deleteMany();

		return NextResponse.json({});
	} catch (error) {
		return NextResponse.json({ error: error });
	}
}
