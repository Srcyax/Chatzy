import { checkRateLimit } from "@/functions/RateLimit";
import { prisma } from "@/functions/prisma";
import { ValidUser } from "@/functions/validUser";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const body = await req.json();
	if (!ValidUser()) {
		return NextResponse.json({ error: "Not allowed" }, { status: 401 });
	}

	const threads = await prisma.thread.findMany({
		where: {
			forum: {
				title: body.title,
			},
		},
	});

	return NextResponse.json({ threads });
}
