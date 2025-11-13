import { Livepeer } from "livepeer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const page = formData.get("page") as string;

    if (!process.env.LIVEPEER_STUDIO) {
      console.error("LIVEPEER_STUDIO API key is not configured");
      return NextResponse.json([]);
    }

    const livepeer = new Livepeer({
      apiKey: process.env.LIVEPEER_STUDIO,
    });

    console.log(`Fetching Livepeer assets page ${page || 1}`);

    const results = await livepeer.asset.getAll();

    console.log("Livepeer response:", results);

    if (Array.isArray(results)) {
      return NextResponse.json(results);
    }

    if (results?.data && Array.isArray(results.data)) {
      return NextResponse.json(results.data);
    }

    return NextResponse.json([]);
  } catch (err: any) {
    console.error("Livepeer API error:", err);
    return NextResponse.json([]);
  }
}
