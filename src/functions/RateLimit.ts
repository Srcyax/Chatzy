import { NextRequest } from "next/server";

import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

const limiter = new Ratelimit({
	redis: kv,
	limiter: Ratelimit.slidingWindow(5, "10s"),
});

export async function checkRateLimit(req: NextRequest) {
	const ip = req.ip ?? "127.0.0.1";

	const { limit, reset, remaining } = await limiter.limit(ip);

	if (remaining === 0) {
		return false;
	}

	return true;
}
