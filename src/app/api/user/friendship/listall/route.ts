import { prisma } from "@/functions/prisma";
import { ValidUser } from "@/functions/validUser";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function GET() {
	if (!ValidUser()) {
		return NextResponse.json({ error: "Not allowed" }, { status: 401 });
	}

	const token = cookies().get("token")?.value as string;

	try {
		const { id } = jwt.decode(token) as JwtPayload;

		const friends = await prisma.friend.findMany({
			where: {
				userId: id,
			},
		});

		return NextResponse.json({ friends: friends });
	} catch (error) {
		console.log(error);
		return NextResponse.json({});
	}
}
