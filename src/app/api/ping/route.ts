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

		const findUser = await prisma.activeUsers.findUnique({
			where: { id: user.id },
		});

		if (!findUser) {
			await prisma.activeUsers.create({
				data: {
					id: user.id,
					username: user.username,
					lastActive: new Date(), // Define lastActive como a data e hora atual
				},
			});
		}

		const updatedUser = await prisma.activeUsers.update({
			where: { id: user.id },
			data: { lastActive: new Date() },
		});

		return NextResponse.json({});
	} catch (error) {
		return NextResponse.json({ error: error });
	}
}

export async function GET() {
	const prisma = new PrismaClient();

	try {
		const activeUsers = await prisma.activeUsers.findMany();
		if (!activeUsers) return NextResponse.json({ users: null });

		return NextResponse.json({ users: activeUsers });
	} catch (error) {
		return NextResponse.json({ error: error });
	} finally {
		await prisma.$disconnect();
	}
}
