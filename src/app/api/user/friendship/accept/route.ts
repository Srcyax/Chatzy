import { prisma } from "@/functions/prisma";
import { ValidUser } from "@/functions/validUser";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
	const body = await req.json();

	if (!ValidUser()) {
		return NextResponse.json({ error: "Not allowed" }, { status: 401 });
	}

	const token = cookies().get("token")?.value as string;

	try {
		const { id } = jwt.decode(token) as JwtPayload;

		return NextResponse.json({ message: "success" });
	} catch (error) {
		console.log(error);
		return NextResponse.json({});
	}
}
