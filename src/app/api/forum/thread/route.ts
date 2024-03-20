import { checkRateLimit } from "@/functions/RateLimit";
import { prisma } from "@/functions/prisma";
import { ValidUser } from "@/functions/validUser";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const result = await checkRateLimit(req);

	if (!result) {
		return NextResponse.json(
			{ error: "Calm down boy! you are making too many requests" },
			{ status: 429 }
		);
	}

	if (!ValidUser()) {
		return NextResponse.json({ error: "Not allowed" }, { status: 401 });
	}

	const body = await req.json();
	const { id } = body;

	const thread = await prisma.thread.findUnique({
		where: {
			id: id,
		},
	});

	if (!thread) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	return NextResponse.json({ thread });
}
