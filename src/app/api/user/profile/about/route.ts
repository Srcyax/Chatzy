import { prisma } from "@/functions/prisma";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ValidateInput } from "@/functions/user/validateInput";
import { ValidUser } from "@/functions/validUser";

export async function POST(req: NextRequest) {
	const body = await req.json();
	const { about } = body;

	if (!ValidUser()) {
		return NextResponse.json({ error: "Not allowed" }, { status: 500 });
	}

	if (!ValidateInput(about, 125)) {
		return NextResponse.json({ error: "Invalid inputs" });
	}

	const token = cookies().get("token");

	try {
		const user = jwt.decode(token!.value) as JwtPayload;

		await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				about: about,
			},
		});

		return NextResponse.json({ message: "About me edited successfully" });
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
