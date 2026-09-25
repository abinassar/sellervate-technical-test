import { NextResponse } from "next/server";
import { getAllMessages } from "@/lib/db/repositories/messages.repository";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getAllMessages();
  return NextResponse.json(data);
}
