import { prisma } from "@/functions/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const body = await req.json();

	const { threadId } = body;

	try {
		const thread = await prisma.thread.findUnique({
			where: {
				id: threadId,
			},
		});

		if (!thread) {
			return NextResponse.json({ error: "Thread not found" }, { status: 404 });
		}

		const comments = await prisma.threadComment.findMany({
			where: {
				threadId: thread.id,
			},
		});

		return NextResponse.json({ comments: comments });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
