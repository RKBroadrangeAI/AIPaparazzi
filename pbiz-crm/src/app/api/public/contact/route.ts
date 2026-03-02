import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Public endpoint for contact form submissions from B2C website
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, subject, message } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "firstName, lastName, and email are required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check for existing lead by email
    const existing = await db.pbizLead.findFirst({
      where: { email },
    });

    if (existing) {
      // Update existing lead with new contact info
      await db.pbizLead.update({
        where: { id: existing.id },
        data: {
          notes: `${existing.notes || ""}\n\n--- Contact Form (${new Date().toISOString()}) ---\nSubject: ${subject || "N/A"}\nMessage: ${message || "N/A"}`.trim(),
          phone: phone || existing.phone,
        },
      });

      return NextResponse.json(
        { message: "Message received", id: existing.id },
        { status: 200 }
      );
    }

    // Create new lead
    const lead = await db.pbizLead.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        source: "WEBSITE",
        status: "NEW",
        temperature: "WARM",
        notes: `Contact form submission\nSubject: ${subject || "N/A"}\nMessage: ${message || "N/A"}`,
      },
    });

    return NextResponse.json(
      { message: "Message received", id: lead.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to process contact form" },
      { status: 500 }
    );
  }
}
