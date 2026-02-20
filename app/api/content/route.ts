import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "quick-share-data.json");

export async function GET() {
    try {
        const fileData = await fs.readFile(filePath, "utf-8");
        const data = JSON.parse(fileData);
        return NextResponse.json({ content: data.text || "" });
    } catch (err) {
        return NextResponse.json({ content: "" });
    }
}

export async function POST(req: Request) {
    try {
        const { content } = await req.json();
        await fs.writeFile(filePath, JSON.stringify({ text: content }));
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ success: false, error: "Failed to save content" });
    }
}