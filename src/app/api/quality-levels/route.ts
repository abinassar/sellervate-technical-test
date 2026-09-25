import { NextResponse } from "next/server";
import { getAllQualityLevels } from "@/lib/db/repositories/quality-levels.repository";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getAllQualityLevels();
  return NextResponse.json(data);
}
