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

		const userExists = await prisma.activeUsers.findUnique({
			where: {
				id: user.id,
			},
		});

		if (userExists) {
			return NextResponse.json({});
		}

		await prisma.activeUsers.create({
			data: {
				id: user.id,
				username: user.username,
			},
		});

		return NextResponse.json({});
	} catch (error) {
		return NextResponse.json({ error: error });
	}
}

export async function GET() {
	const prisma = new PrismaClient();

	const activeUsers = await prisma.activeUsers.findMany();
	return NextResponse.json({ users: activeUsers });
}
