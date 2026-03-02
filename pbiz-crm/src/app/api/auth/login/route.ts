import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, hashPassword, createSession } from "@/lib/auth";

async function ensureAdminExists() {
  const count = await db.pbizUser.count();
  if (count > 0) return;

  console.log("[PBiz Auth] No users found — creating default admin account");
  const passwordHash = await hashPassword("broadrangeAI2026");
  await db.pbizUser.create({
    data: {
      email: "admin@paparazzibybiz.com",
      passwordHash,
      firstName: "Admin",
      lastName: "PBiz",
      role: "ADMIN",
      isOnline: true,
    },
  });
  console.log("[PBiz Auth] Default admin created: admin@paparazzibybiz.com");
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    await ensureAdminExists();

    const user = await db.pbizUser.findUnique({ where: { email: email.toLowerCase() } });

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await createSession(user.id, user.email, user.role);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("[PBiz Auth] Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
