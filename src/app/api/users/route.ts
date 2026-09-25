import { NextResponse } from "next/server";
import { getAllUsers } from "@/lib/db/repositories/users.repository";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getAllUsers();
  return NextResponse.json(data);
}
