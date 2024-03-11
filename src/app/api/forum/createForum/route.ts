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
		await prisma.forum.create({
			data: {
				title: body.title,
				description: body.description,
			},
			include: {
				thread: true,
			},
		});

		return NextResponse.json({});
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
