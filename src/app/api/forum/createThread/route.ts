import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "@/functions/prisma";
import { ValidUser } from "@/functions/validUser";

export async function POST(req: NextRequest) {
	const body = await req.json();

	if (!ValidUser()) {
		return NextResponse.json({ error: "Not allowed" }, { status: 500 });
	}

	try {
		const forum = await prisma.forum.findUnique({
			where: {
				title: body.forum,
			},
		});

		if (!forum) {
			return NextResponse.json({ error: "Forum not found" }, { status: 404 });
		}

		await prisma.thread.create({
			data: {
				title: body.title,
				description: body.description,
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

		return NextResponse.json({});
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
