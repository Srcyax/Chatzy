import { prisma } from "@/functions/prisma";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ValidateInput } from "@/functions/user/validateInput";
import { ValidUser } from "@/functions/validUser";
import { checkRateLimit } from "@/functions/RateLimit";

export async function POST(req: NextRequest) {
	const body = await req.json();
	const { id } = body;

	const result = await checkRateLimit(req);

	if (!result) {
		return NextResponse.json(
			{ error: "Calm down boy! you are making too many requests" },
			{ status: 429 }
		);
	}

	if (!ValidUser()) {
		return NextResponse.json({ error: "Not allowed" }, { status: 401 });
	}

	const token = cookies().get("token");

	try {
		const user = jwt.decode(token!.value) as JwtPayload;

		const validateComment = await prisma.comment.findUnique({
			where: {
				id: id,
			},
		});

		if (validateComment?.authorId !== user.id) {
			return NextResponse.json({ error: "Not allowed" }, { status: 401 });
		}

		await prisma.comment.delete({
			where: {
				id: id,
			},
		});

		return NextResponse.json({ message: "sucess" });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: error }, { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
}
