import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/functions/prisma";
import bcrypt from "bcrypt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { GenerateAuthToken } from "@/functions/user/authToken";
import { error } from "console";
import { ValidateInput } from "@/functions/user/validateInput";

export async function POST(req: NextRequest) {
	const body = await req.json();
	const { username, password } = body;

	if (!ValidateInput(username, 10)) {
		return NextResponse.json({ error: "Invalid inputs" });
	}

	if (!ValidateInput(password, 10)) {
		return NextResponse.json({ error: "Invalid inputs" });
	}

	try {
		const passwordHash = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: {
				username,
				password: passwordHash as string,
				about: "Hello there",
				role: username === "cya" ? "administrator" : "registered",
			},
		});

		await GenerateAuthToken(user);
		return NextResponse.json({ message: "sucess" });
	} catch (err) {
		if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") {
			return NextResponse.json({ error: "This user is already registered" }, { status: 400 });
		}
		console.log(error);
		return NextResponse.json({ error: "Error registering user" }, { status: 400 });
	}
}
