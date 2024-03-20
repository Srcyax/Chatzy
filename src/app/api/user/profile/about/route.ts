import { prisma } from "@/functions/prisma";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ValidUser } from "@/functions/validUser";

export async function POST(req: NextRequest) {
	const body = await req.json();

	const { about } = body;

	if (!ValidUser()) {
		return NextResponse.json({ error: "Not allowed" }, { status: 401 });
	}

	const token = cookies().get("token")?.value as string;

	try {
		const { id } = jwt.decode(token) as JwtPayload;

		await prisma.user.update({
			where: {
				id: id,
			},
			data: {
				about: about,
			},
		});

		return NextResponse.json({ message: "success" });
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
