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

		const requests = await prisma.friendRequest.findMany({
			where: {
				userId: id,
			},
		});

		console.log(requests);

		return NextResponse.json({ requests });
	} catch (error) {
		console.log(error);
		return NextResponse.json({});
	}
}
