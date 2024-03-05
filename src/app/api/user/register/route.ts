import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { GenerateAuthToken } from "@/functions/user/authToken";
import { error } from "console";

export async function POST(req: NextRequest) {
	const body = await req.json();
	const { username, password } = body;

	const prisma = new PrismaClient();

	try {
		const passwordHash = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: {
				username,
				password: passwordHash as string,
				about: "Hello there 👋",
			},
		});

		await GenerateAuthToken(user);

		return NextResponse.json({ message: "sucess" });
	} catch (err) {
		if (
			err instanceof PrismaClientKnownRequestError &&
			err.code === "P2002"
		) {
			return NextResponse.json(
				{ error: "This user is already registered" },
				{ status: 400 }
			);
		}
		console.log(error);
		return NextResponse.json(
			{ error: "Error registering user" },
			{ status: 400 }
		);
	} finally {
		await prisma.$disconnect();
	}
}
