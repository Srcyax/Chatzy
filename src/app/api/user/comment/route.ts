import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function POST(req: NextRequest) {
	const body = await req.json();
	const { comment } = body;
	const prisma = new PrismaClient();

	const token = cookies().get("token");

	if (!token) {
		return NextResponse.json({ error: "Not allowed" }, { status: 401 });
	}

	try {
		const user = (await jwt.decode(token.value)) as JwtPayload;

		if (!user.id) {
			return NextResponse.json({ error: "Not allowed" }, { status: 401 });
		}

		const comments = await prisma.comment.findMany();

		if (comments.length > 25) {
			await prisma.comment.delete({
				where: {
					id: comments.at(0)?.id,
					comment: comments.at(0)?.comment,
				},
			});
		}

		await prisma.comment.create({
			data: {
				comment,
				authorId: user.id,
				author: user.username,
			},
		});

		return NextResponse.json({ message: "sucess" });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: error }, { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
}

export async function GET() {
	const prisma = new PrismaClient();
	try {
		const comments = await prisma.comment.findMany();

		return NextResponse.json({ comments });
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
}
