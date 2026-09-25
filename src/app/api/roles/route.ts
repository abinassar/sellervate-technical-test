import { NextResponse } from "next/server";
import { getAllRoles } from "@/lib/db/repositories/roles.repository";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getAllRoles();
  return NextResponse.json(data);
}
