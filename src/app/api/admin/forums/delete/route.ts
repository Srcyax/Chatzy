import { prisma } from "@/functions/prisma";
import { ValidUser } from "@/functions/validUser";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const body = await req.json();

	if (!ValidUser()) {
		return NextResponse.json({ error: "Not allowed" }, { status: 401 });
	}
	const token = cookies().get("token")?.value;

	try {
		const user = jwt.decode(token!) as JwtPayload;

		const validateUser = await prisma.user.findUnique({
			where: {
				id: user.id,
				role: "administrator",
			},
		});

		if (!validateUser) {
			return NextResponse.json({ error: "Not allowed" }, { status: 500 });
		}

		await prisma.forum.delete({
			where: {
				id: body.id,
			},
		});

		return NextResponse.json({});
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
