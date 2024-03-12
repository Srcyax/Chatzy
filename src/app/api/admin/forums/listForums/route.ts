import { prisma } from "@/functions/prisma";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const forums = await prisma.forum.findMany();
		return NextResponse.json({ forums });
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
