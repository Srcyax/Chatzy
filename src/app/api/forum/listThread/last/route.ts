import { prisma } from "@/functions/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const body = await req.json();

	const threads = await prisma.thread.findMany({
		where: {
			forum: {
				title: body.title,
			},
		},
	});

	const lastThread = threads[threads.length - 1];

	return NextResponse.json({ lastThread });
}
