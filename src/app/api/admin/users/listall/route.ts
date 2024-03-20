import { prisma } from "@/functions/prisma";
import { ValidUser } from "@/functions/validUser";
import { NextResponse } from "next/server";

export async function GET() {
	if (!ValidUser()) {
		return NextResponse.json({ error: "Not allowed" }, { status: 401 });
	}

	const users = await prisma.user.findMany();

	return NextResponse.json({ users });
}
