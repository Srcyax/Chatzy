import { prisma } from "@/functions/prisma";
import { ValidUser } from "@/functions/validUser";
import { NextResponse } from "next/server";

export async function GET() {
	if (!ValidUser()) {
		return NextResponse.json({ error: "Not allowed" }, { status: 401 });
	}

	try {
		const forums = await prisma.forum.findMany();
		return NextResponse.json({ forums });
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
