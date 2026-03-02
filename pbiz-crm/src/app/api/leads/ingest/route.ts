import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Public endpoint for lead ingestion from B2C website
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, source, styleInterest, sizePreference, notes } = body;

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "firstName and lastName are required" },
        { status: 400 }
      );
    }

    // Check for duplicate by email
    if (email) {
      const existing = await db.pbizLead.findFirst({
        where: { email },
      });
      if (existing) {
        return NextResponse.json(
          { message: "Lead already exists", id: existing.id },
          { status: 200 }
        );
      }
    }

    const lead = await db.pbizLead.create({
      data: {
        firstName,
        lastName,
        email: email || null,
        phone: phone || null,
        source: source || "WEBSITE",
        styleInterest: styleInterest || null,
        sizePreference: sizePreference || null,
        notes: notes || null,
        status: "NEW",
      },
    });

    return NextResponse.json({ message: "Lead created", id: lead.id }, { status: 201 });
  } catch (error) {
    console.error("Lead ingest error:", error);
    return NextResponse.json(
      { error: "Failed to ingest lead" },
      { status: 500 }
    );
  }
}
