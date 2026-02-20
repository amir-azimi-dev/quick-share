import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function GET() {
    try {
        const content = await redis.get("quick-share-content");

        return NextResponse.json({ content: content ?? "" });
    } catch (err) {
        return NextResponse.json({ content: "" });
    }
}

export async function POST(req: Request) {
    try {
        const { content } = await req.json();

        await redis.set("quick-share-content", content);

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ success: false, error: "Failed to save content" });
    }
}