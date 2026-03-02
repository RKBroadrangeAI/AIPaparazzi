import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession, hashPassword } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const users = await db.pbizUser.findMany({
    select: { id: true, email: true, firstName: true, lastName: true, role: true, isOnline: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ users });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { email, password, firstName, lastName, role } = await request.json();

  if (!email || !password || !firstName || !lastName) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  const existing = await db.pbizUser.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already exists" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await db.pbizUser.create({
    data: { email: email.toLowerCase(), passwordHash, firstName, lastName, role: role || "CONSULTANT" },
  });

  return NextResponse.json({ user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } });
}
