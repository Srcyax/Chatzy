import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "@/functions/prisma";
import { ValidUser } from "@/functions/validUser";

export async function POST(req: NextRequest) {
	if (!ValidUser()) {
		return NextResponse.json({ error: "Not allowed" }, { status: 401 });
	}

	const token = cookies().get("token")?.value as string;

	try {
		const user = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

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
					lastActive: new Date(),
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
	if (!ValidUser()) {
		return NextResponse.json({ error: "Not allowed" }, { status: 401 });
	}

	try {
		const activeUsers = await prisma.activeUsers.findMany();
		if (!activeUsers) return NextResponse.json({ users: null });

		return NextResponse.json({ users: activeUsers });
	} catch (error) {
		return NextResponse.json({ error: error });
	}
}
