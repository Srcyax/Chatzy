import { prisma } from "@/functions/prisma";
import { ValidUser } from "@/functions/validUser";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const body = await req.json();

	if (!ValidUser()) {
		return NextResponse.json({ error: "Not allowed" }, { status: 401 });
	}

	try {
		await prisma.notifications.delete({
			where: {
				id: body.id,
			},
		});

		return NextResponse.json({ message: "success" });
	} catch (error) {
		console.log(error);
		return NextResponse.json({});
	}
}
