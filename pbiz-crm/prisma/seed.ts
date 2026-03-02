import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log("🧵 Seeding PaparazziByBiz CRM...");

  // Create admin user
  const adminHash = await bcrypt.hash("broadrangeAI2026", 12);
  const admin = await prisma.pbizUser.upsert({
    where: { email: "admin@paparazzibybiz.com" },
    update: {},
    create: {
      email: "admin@paparazzibybiz.com",
      passwordHash: adminHash,
      firstName: "Admin",
      lastName: "PBiz",
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user:", admin.email);

  // Create manager
  const mgrHash = await bcrypt.hash("broadrangeAI2026", 12);
  const mgr = await prisma.pbizUser.upsert({
    where: { email: "manager@paparazzibybiz.com" },
    update: {},
    create: {
      email: "manager@paparazzibybiz.com",
      passwordHash: mgrHash,
      firstName: "Sarah",
      lastName: "Mitchell",
      role: "MANAGER",
    },
  });
  console.log("✅ Manager:", mgr.email);

  // Create consultant users
  const consultants = [
    { email: "jade@paparazzibybiz.com", first: "Jade", last: "Williams", specialties: "streetwear,casual" },
    { email: "maya@paparazzibybiz.com", first: "Maya", last: "Chen", specialties: "formal,evening" },
    { email: "alex@paparazzibybiz.com", first: "Alex", last: "Rivera", specialties: "activewear,athleisure" },
  ];

  for (const c of consultants) {
    const hash = await bcrypt.hash("broadrangeAI2026", 12);
    const user = await prisma.pbizUser.upsert({
      where: { email: c.email },
      update: {},
      create: {
        email: c.email,
        passwordHash: hash,
        firstName: c.first,
        lastName: c.last,
        role: "CONSULTANT",
        specialties: c.specialties,
      },
    });

    await prisma.pbizConsultant.upsert({
      where: { email: c.email },
      update: {},
      create: {
        name: `${c.first} ${c.last}`,
        email: c.email,
        specialties: c.specialties,
        capacityPerDay: 8,
      },
    });
    console.log("✅ Consultant:", user.email);
  }

  // Sample products
  const products = [
    { name: "Urban Edge Hoodie", sku: "PB-HOD-001", category: "tops", subcategory: "hoodies", price: 59.99, costPrice: 22, sizes: '["S","M","L","XL"]', colors: '["Black","Charcoal","Olive"]', stockQty: 45 },
    { name: "Velvet Drape Dress", sku: "PB-DRS-001", category: "dresses", subcategory: "midi", price: 89.99, costPrice: 32, sizes: '["XS","S","M","L"]', colors: '["Burgundy","Black","Navy"]', stockQty: 30 },
    { name: "Flex Jogger Pants", sku: "PB-BTM-001", category: "bottoms", subcategory: "joggers", price: 49.99, costPrice: 18, sizes: '["S","M","L","XL","XXL"]', colors: '["Black","Grey","Navy"]', stockQty: 60 },
    { name: "Satin Bomber Jacket", sku: "PB-OUT-001", category: "outerwear", subcategory: "jackets", price: 119.99, costPrice: 45, sizes: '["S","M","L","XL"]', colors: '["Black","Rose Gold","Silver"]', stockQty: 25 },
    { name: "Cropped Logo Tee", sku: "PB-TOP-001", category: "tops", subcategory: "tees", price: 34.99, costPrice: 10, sizes: '["XS","S","M","L"]', colors: '["White","Black","Pink","Sage"]', stockQty: 80 },
    { name: "High-Waist Cargo", sku: "PB-BTM-002", category: "bottoms", subcategory: "cargo", price: 64.99, costPrice: 24, sizes: '["XS","S","M","L","XL"]', colors: '["Khaki","Black","Olive"]', stockQty: 40 },
    { name: "Statement Belt Bag", sku: "PB-ACC-001", category: "accessories", subcategory: "bags", price: 29.99, costPrice: 8, sizes: '["ONE SIZE"]', colors: '["Black","Tan","White"]', stockQty: 55 },
    { name: "Oversized Blazer", sku: "PB-OUT-002", category: "outerwear", subcategory: "blazers", price: 99.99, costPrice: 38, sizes: '["S","M","L"]', colors: '["Black","Camel","Check"]', stockQty: 20 },
  ];

  for (const p of products) {
    await prisma.pbizProduct.upsert({
      where: { sku: p.sku },
      update: {},
      create: p,
    });
  }
  console.log("✅ Products seeded:", products.length);

  // Sample customers
  const customers = [
    { firstName: "Sophia", lastName: "Jackson", email: "sophia.j@email.com", phone: "404-555-0101", isVip: true, totalSpend: 1250, preferences: '{"style":"streetwear","favoriteColors":["black","olive"]}', sizeProfile: '{"top":"M","bottom":"S","shoes":"8"}' },
    { firstName: "Tanya", lastName: "Brooks", email: "tanya.b@email.com", phone: "404-555-0102", isVip: false, totalSpend: 340, preferences: '{"style":"casual","favoriteColors":["white","sage"]}', sizeProfile: '{"top":"S","bottom":"S","shoes":"7"}' },
    { firstName: "Marcus", lastName: "Lee", email: "marcus.l@email.com", phone: "404-555-0103", isVip: true, totalSpend: 2100, preferences: '{"style":"formal","favoriteColors":["navy","black"]}', sizeProfile: '{"top":"L","bottom":"L","shoes":"11"}' },
    { firstName: "Aaliyah", lastName: "Davis", email: "aaliyah.d@email.com", phone: "404-555-0104", isVip: false, totalSpend: 180, preferences: '{"style":"activewear","favoriteColors":["pink","grey"]}', sizeProfile: '{"top":"XS","bottom":"XS","shoes":"6"}' },
  ];

  for (const c of customers) {
    await prisma.pbizCustomer.upsert({
      where: { email: c.email },
      update: {},
      create: c,
    });
  }
  console.log("✅ Customers seeded:", customers.length);

  // Sample leads
  const leadData = [
    { firstName: "Jasmine", lastName: "Patel", email: "jasmine.p@email.com", source: "INSTAGRAM", status: "NEW", temperature: "HOT", styleInterest: "streetwear", aiScore: 85 },
    { firstName: "Derek", lastName: "Thompson", email: "derek.t@email.com", source: "WEBSITE", status: "CONTACTED", temperature: "WARM", styleInterest: "formal", aiScore: 62 },
    { firstName: "Nina", lastName: "Rodriguez", email: "nina.r@email.com", source: "TIKTOK", status: "QUALIFIED", temperature: "HOT", styleInterest: "casual", aiScore: 91 },
    { firstName: "Chris", lastName: "Washington", phone: "404-555-0201", source: "WALK_IN", status: "NEW", temperature: "COLD", styleInterest: "activewear", aiScore: 40 },
    { firstName: "Lena", lastName: "Kim", email: "lena.k@email.com", source: "REFERRAL", status: "NEW", temperature: "WARM", styleInterest: "evening", aiScore: 72 },
  ];

  for (const l of leadData) {
    const existing = await prisma.pbizLead.findFirst({ where: { email: l.email, firstName: l.firstName } });
    if (!existing) {
      await prisma.pbizLead.create({ data: l });
    }
  }
  console.log("✅ Leads seeded:", leadData.length);

  console.log("\n🎉 PaparazziByBiz CRM seed complete!");
  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
