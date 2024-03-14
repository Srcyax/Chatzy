import { prisma } from "@/functions/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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
