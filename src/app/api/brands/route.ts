import { NextResponse } from "next/server";
import { getAllBrands } from "@/lib/db/repositories/brands.repository";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getAllBrands();
  return NextResponse.json(data);
}
