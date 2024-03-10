import { prisma } from "@/functions/prisma";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ValidateInput } from "@/functions/user/validateInput";

export async function POST(req: NextRequest) {
	const body = await req.json();
	const { comment } = body;

	const token = cookies().get("token");

	if (!token) {
		return NextResponse.json({ error: "Not allowed" }, { status: 401 });
	}

	if (!ValidateInput(comment, 125)) {
		return NextResponse.json({ error: "Invalid inputs" });
	}

	try {
		const user = jwt.verify(token.value, process.env.JWT_SECRET as string) as JwtPayload;

		if (!user) {
			return NextResponse.json({ error: "Not allowed" }, { status: 401 });
		}

		if (!user.id) {
			return NextResponse.json({ error: "Not allowed" }, { status: 401 });
		}

		const userValidate = await prisma.user.findUnique({
			where: {
				id: user.id,
			},
		});

		if (!userValidate) {
			return NextResponse.json({ error: "Not allowed" }, { status: 401 });
		}

		if (userValidate?.role === "banned") {
			return NextResponse.json({ error: "You are banned!" }, { status: 403 });
		}

		const comments = await prisma.comment.findMany();

		if (comments.length > 25) {
			await prisma.comment.delete({
				where: {
					id: comments.at(0)?.id,
					text: comments.at(0)?.text,
				},
			});
		}

		await prisma.comment.create({
			data: {
				text: comment,
				author: {
					connect: {
						id: user.id,
					},
				},
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
