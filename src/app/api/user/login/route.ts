import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/functions/prisma";
import bcrypt from "bcrypt";
import { GenerateAuthToken } from "@/functions/user/authToken";

export async function POST(req: NextRequest) {
	const body = await req.json();
	const { username, password } = body;

	try {
		const user = await prisma.user.findUnique({
			where: {
				username: username,
			},
		});

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		const passwordVerify = await bcrypt.compare(password, user?.password as string);

		if (!passwordVerify) {
			return NextResponse.json({ error: "Wrong password" }, { status: 500 });
		}

		if (user.role === "banned") {
			return NextResponse.json({ error: "You have been banned from Chatzy" }, { status: 500 });
		}

		await GenerateAuthToken(user);

		return NextResponse.json({ message: "sucess" });
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
