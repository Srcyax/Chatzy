import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { differenceInSeconds } from "date-fns";
import { PrismaClient } from "@prisma/client";
import { ValidUser } from "@/functions/validUser";
import { checkRateLimit } from "@/functions/RateLimit";

export async function POST(req: NextRequest) {
	if (!ValidUser()) {
		return NextResponse.json({ error: "Not allowed" }, { status: 401 });
	}

	const prisma = new PrismaClient();

	const inactivityThreshold = 10;
	const currentTime = new Date();

	try {
		const activeUsers = await prisma.activeUsers.findMany();

		for (const user of activeUsers) {
			const lastActivity = user.lastActive;
			const secondsSinceLastActivity = differenceInSeconds(currentTime, lastActivity);
			if (secondsSinceLastActivity > inactivityThreshold) {
				try {
					const removeUser = await prisma.activeUsers.delete({
						where: {
							id: user.id,
						},
					});

					if (!removeUser) {
						console.error("Failed to remove user:", user.id);
					}
				} catch (error) {
					console.error("Error deleting user:", error);
				}
			}
		}

		return NextResponse.json({});
	} catch (error) {
		console.error("Error fetching active users:", error);
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
