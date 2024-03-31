import { prisma } from "@/functions/prisma";
import { ValidUser } from "@/functions/validUser";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function POST(req: NextRequest) {
	const body = await req.json();

	if (!ValidUser()) {
		return NextResponse.json({ error: "Not allowed" }, { status: 401 });
	}

	const token = cookies().get("token")?.value as string;

	try {
		const { id, role } = jwt.decode(token) as JwtPayload;

		if (id === body.id) {
			return NextResponse.json({});
		}

		if (role === "banned") {
			return NextResponse.json({});
		}

		const user = await prisma.user.findUnique({
			where: {
				id: id,
			},
		});

		await prisma.notifications.create({
			data: {
				title: user?.username + " wants to be your friend",
				userId: body.id,
				type: "friend_request",
			},
		});

		return NextResponse.json({ message: "success" });
	} catch (error) {
		console.log(error);
		if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
			return NextResponse.json(
				{ error: "You have already requested friendship for this user" },
				{ status: 400 }
			);
		}
		return NextResponse.json({});
	}
}
