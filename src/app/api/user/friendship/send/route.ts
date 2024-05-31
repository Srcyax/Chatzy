import { prisma } from "@/functions/prisma";
import { ValidUser } from "@/functions/validUser";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function POST(req: NextRequest) {
	const body = await req.json();

	if (!ValidUser()) {
		return NextResponse.json({ error: "Not allowed" }, { status: 401 });
	}

	const token = cookies().get("token")?.value as string;

	try {
		const { username } = jwt.decode(token) as JwtPayload;

		const request_friend = await prisma.user.update({
			where: {
				id: body.id,
			},
			data: {
				friendRequests: {
					create: {
						requester: username,
					},
				},
			},
		});

		console.log(request_friend);

		return NextResponse.json({});
	} catch (error) {
		console.log(error);
	}
}
