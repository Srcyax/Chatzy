import { ValidUser } from "@/functions/validUser";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
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

	const { threadId, text } = body;

	if (!ValidUser()) {
		return NextResponse.json({ error: "Not allowed" }, { status: 401 });
	}

	const token = cookies().get("token")?.value as string;

	try {
		const user = jwt.decode(token) as JwtPayload;

		const comment = await prisma.threadComment.create({
			data: {
				text: text,
				author: user.username,
				threadId: threadId,
			},
		});

		console.log(comment);

		return NextResponse.json({ message: "Sucess" });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
