import { NextResponse } from "next/server";
import { getAllConversations } from "@/lib/db/repositories/conversations.repository";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getAllConversations();
  return NextResponse.json(data);
}
