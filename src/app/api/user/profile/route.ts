import { prisma } from "@/functions/prisma";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ValidUser } from "@/functions/validUser";

export async function POST(req: NextRequest) {
	const body = await req.json();

	const { id } = body;

	if (!ValidUser()) {
		return NextResponse.json({ error: "Not allowed" }, { status: 401 });
	}

	const token = cookies().get("token")?.value as string;

	try {
		const userProfile = await prisma.user.findUnique({
			where: {
				id: id,
			},
		});

		const user = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

		return NextResponse.json({ userProfile, isOwner: user.id === id });
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
