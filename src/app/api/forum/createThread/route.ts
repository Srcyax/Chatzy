import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "@/functions/prisma";
import { ValidUser } from "@/functions/validUser";

export async function POST(req: NextRequest) {
	const body = await req.json();

	if (!ValidUser()) {
		return NextResponse.json({ error: "Not allowed" }, { status: 401 });
	}

	const token = cookies().get("token")?.value as string;

	try {
		const user = jwt.decode(token) as JwtPayload;

		const forum = await prisma.forum.findUnique({
			where: {
				title: body.forum,
			},
		});

		if (!forum) {
			return NextResponse.json({ error: "Forum not found" }, { status: 404 });
		}

		const thread = await prisma.thread.create({
			data: {
				title: body.title,
				description: body.description,
				author: user.username,
				forum: {
					connect: {
						id: forum?.id,
					},
				},
			},
			include: {
				forum: true,
			},
		});

		return NextResponse.json({ thread });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
