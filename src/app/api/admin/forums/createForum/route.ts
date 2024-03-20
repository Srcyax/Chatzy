import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "@/functions/prisma";
import { ValidUser } from "@/functions/validUser";
import { checkRateLimit } from "@/functions/RateLimit";

export async function POST(req: NextRequest) {
	const body = await req.json();

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
			return NextResponse.json({ error: "Not allowed" }, { status: 401 });
		}

		await prisma.forum.create({
			data: {
				title: body.title,
				description: body.description,
			},
			include: {
				thread: true,
			},
		});

		return NextResponse.json({});
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
