import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { differenceInMinutes, differenceInSeconds } from "date-fns";
import { PrismaClient } from "@prisma/client";

export async function POST(req: NextRequest) {
	const token = cookies().get("token");
	const prisma = new PrismaClient();

	const inactivityThreshold = 10;
	const currentTime = new Date();

	const activeUsers = await prisma.activeUsers.findMany();

	for (const user of activeUsers) {
		const lastActivity = user.lastActive;
		const minutesSinceLastActivity = differenceInSeconds(currentTime, lastActivity);
		if (minutesSinceLastActivity > inactivityThreshold) {
			const deleteuser = await prisma.activeUsers.delete({
				where: {
					id: user.id,
				},
			});
		}
	}

	return NextResponse.json({});
}
