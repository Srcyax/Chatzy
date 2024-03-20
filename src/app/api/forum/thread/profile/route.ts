import { ValidUser } from "@/functions/validUser";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "@/functions/prisma";
import { checkRateLimit } from "@/functions/RateLimit";

export async function POST(req: NextRequest) {
	const body = await req.json();

	const result = await checkRateLimit(req);

	if (!result) {
		return NextResponse.json(
			{ error: "Calm down boy! you are making too many requests" },
			{ status: 429 }
		);
	}

	const { threadId } = body;

	if (!ValidUser()) {
		return NextResponse.json({ error: "Not allowed" }, { status: 401 });
	}

	const token = cookies().get("token")?.value as string;
	const { id } = jwt.decode(token) as JwtPayload;

	const thread = await prisma.thread.findUnique({
		where: {
			id: threadId,
		},
	});

	const userProfile = await prisma.user.findUnique({
		where: {
			username: thread?.author,
		},
	});

	return NextResponse.json({ userProfile });
}
