import { prisma } from "@/functions/prisma";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ValidateInput } from "@/functions/user/validateInput";
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

	const { comment } = body;

	if (!ValidUser()) {
		return NextResponse.json({ error: "Not allowed" }, { status: 401 });
	}

	if (!ValidateInput(comment, 125)) {
		return NextResponse.json({ error: "Invalid inputs" });
	}

	const token = cookies().get("token");

	try {
		const user = jwt.decode(token!.value) as JwtPayload;

		const comments = await prisma.comment.findMany();

		if (comments.length > 25) {
			await prisma.comment.delete({
				where: {
					id: comments.at(0)?.id,
					text: comments.at(0)?.text,
				},
			});
		}

		const date = new Date();

		await prisma.comment.create({
			data: {
				text: comment,
				author: {
					connect: {
						id: user.id,
					},
				},
				at:
					date.getMonth() +
					1 +
					"/" +
					date.getDate() +
					"/" +
					date.getFullYear() +
					" at " +
					date.getHours() +
					":" +
					date.getMinutes(),
			},
			include: {
				author: true,
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

export async function GET() {
	if (!ValidUser()) {
		return NextResponse.json({ error: "Not allowed" }, { status: 401 });
	}

	try {
		const comments = await prisma.comment.findMany({
			include: {
				author: {
					select: {
						username: true,
						role: true,
						about: true,
					},
				},
			},
			orderBy: {
				id: "asc",
			},
		});

		comments.forEach(async (validComment) => {
			const validUser = await prisma.user.findUnique({
				where: {
					id: validComment.authorId,
				},
			});

			if (!validUser) {
				await prisma.comment.delete({
					where: {
						id: validComment.id,
					},
				});
			}
		});

		return NextResponse.json({ comments });
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
