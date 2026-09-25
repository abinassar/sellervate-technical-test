import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/db/repositories/products.repository";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getAllProducts();
  return NextResponse.json(data);
}
