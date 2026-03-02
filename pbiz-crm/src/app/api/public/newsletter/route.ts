import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Public endpoint for newsletter signups from B2C website
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, source } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
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

    // Check if already subscribed (check leads by email)
    const existing = await db.pbizLead.findFirst({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Already subscribed", id: existing.id },
        { status: 200 }
      );
    }

    // Create a lead from newsletter signup
    const lead = await db.pbizLead.create({
      data: {
        firstName: "Newsletter",
        lastName: "Subscriber",
        email,
        source: source || "WEBSITE",
        status: "NEW",
        temperature: "WARM",
        notes: `Newsletter signup from ${source || "website"} on ${new Date().toISOString()}`,
      },
    });

    return NextResponse.json(
      { message: "Subscribed successfully", id: lead.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json(
      { error: "Failed to process signup" },
      { status: 500 }
    );
  }
}
