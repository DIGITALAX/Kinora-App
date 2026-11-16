import { NextResponse } from "next/server";
import {
  RATE_LIMIT_MAX_KEYS,
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS,
} from "../constants";

const buckets = new Map<string, { count: number; resetAt: number }>();

export const isSameOrigin = (req: Request): boolean => {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    const originHost = new URL(origin).host.toLowerCase();
    const baseHost = process.env.NEXT_PUBLIC_BASE_URL
      ? new URL(process.env.NEXT_PUBLIC_BASE_URL).host
      : undefined;
    return [
      req.headers.get("host"),
      req.headers.get("x-forwarded-host"),
      baseHost,
    ].some((host) => host?.split(",")[0]?.trim().toLowerCase() === originHost);
  } catch (err: any) {
    return false;
  }
};

export const isRateLimited = (req: Request, scope: string): boolean => {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")?.[0]?.trim() || "unknown";
  const key = `${scope}:${ip}`;
  const now = Date.now();

  if (buckets.size > RATE_LIMIT_MAX_KEYS) {
    buckets.forEach((bucket, bucketKey) => {
      if (bucket.resetAt <= now) buckets.delete(bucketKey);
    });
    if (buckets.size > RATE_LIMIT_MAX_KEYS) buckets.clear();
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX_REQUESTS;
};

const guardApiRequest = (req: Request, scope: string): NextResponse | null => {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
  }

  if (isRateLimited(req, scope)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  return null;
};

export default guardApiRequest;
