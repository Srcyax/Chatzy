import { ValidUser } from "@/functions/validUser";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "@/functions/prisma";

export async function GET() {
	if (!ValidUser()) {
		return NextResponse.json({ error: "Not allowed" }, { status: 500 });
	}

	const token = cookies().get("token")?.value as string;
	const { id } = jwt.decode(token) as JwtPayload;
	console.log();

	const userProfile = await prisma.user.findUnique({
		where: {
			id: id,
		},
	});

	return NextResponse.json({ userProfile });
}
