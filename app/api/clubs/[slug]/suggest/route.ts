import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await req.json();

  const verein = await prisma.verein.findUnique({ where: { slug } });
  if (!verein) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Only update fields that were explicitly provided
  const update: Record<string, unknown> = {};

  if (body.name?.trim())        update.name        = body.name.trim();
  if (body.description?.trim()) update.description = body.description.trim();
  if (body.website?.trim())     update.website     = body.website.trim();
  if (body.email?.trim())       update.email       = body.email.trim();
  if (body.phone?.trim())       update.phone       = body.phone.trim();
  if (body.address?.trim())     update.addressRaw  = body.address.trim();

  if (body.category?.trim()) {
    update.categories = JSON.stringify([body.category.trim()]);
  }

  if (Array.isArray(body.tags) && body.tags.length > 0) {
    update.tags = JSON.stringify(body.tags);
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const updated = await prisma.verein.update({
    where: { slug },
    data: update,
  });

  return NextResponse.json({ success: true, slug: updated.slug });
}
