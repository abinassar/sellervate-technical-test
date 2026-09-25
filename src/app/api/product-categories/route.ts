import { NextResponse } from "next/server";
import { getAllProductCategories } from "@/lib/db/repositories/product-categories.repository";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getAllProductCategories();
  return NextResponse.json(data);
}
