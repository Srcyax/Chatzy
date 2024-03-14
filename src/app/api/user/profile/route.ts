import { prisma } from "@/functions/prisma";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function POST(req: NextRequest) {
	const body = await req.json();

	const { id } = body;

	try {
		const userProfile = await prisma.user.findUnique({
			where: {
				id: id,
			},
		});

		const token = cookies().get("token");

		if (!token) {
			return NextResponse.json({ userProfile, isLocalUser: false });
		}

		const user = jwt.verify(token.value, process.env.JWT_SECRET as string) as JwtPayload;

		return NextResponse.json({ userProfile, isOwner: user.id === id });
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
