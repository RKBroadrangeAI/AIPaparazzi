import { db } from "./db";

// ─── Dashboard Stats ─────────────────────────────────────
export async function getDashboardStats() {
  const [leads, customers, deals, orders] = await Promise.all([
    db.pbizLead.count(),
    db.pbizCustomer.count(),
    db.pbizDeal.count(),
    db.pbizOrder.count(),
  ]);

  const [hotLeads, revenue, vipCustomers, activeDeals] = await Promise.all([
    db.pbizLead.count({ where: { temperature: "HOT" } }),
    db.pbizDeal.aggregate({ _sum: { value: true }, where: { stage: "CLOSED_WON" } }),
    db.pbizCustomer.count({ where: { isVip: true } }),
    db.pbizDeal.count({ where: { stage: { notIn: ["CLOSED_WON", "CLOSED_LOST"] } } }),
  ]);

  return {
    totalLeads: leads,
    activeLeads: leads,
    totalCustomers: customers,
    totalDeals: deals,
    openDeals: activeDeals,
    totalOrders: orders,
    hotLeads,
    revenue: revenue._sum.value ?? 0,
    pipelineValue: revenue._sum.value ?? 0,
    vipCustomers,
    activeDeals,
  };
}

// ─── System Stats ────────────────────────────────────────
export async function getSystemStats() {
  const [users, consultants, leads, customers, deals, messages, appointments, activities, products] = await Promise.all([
    db.pbizUser.count(),
    db.pbizConsultant.count(),
    db.pbizLead.count(),
    db.pbizCustomer.count(),
    db.pbizDeal.count(),
    db.pbizMessage.count(),
    db.pbizAppointment.count(),
    db.pbizActivity.count(),
    db.pbizProduct.count(),
  ]);

  return {
    totalUsers: users,
    totalConsultants: consultants,
    totalLeads: leads,
    totalCustomers: customers,
    totalDeals: deals,
    totalMessages: messages,
    totalAppointments: appointments,
    totalActivities: activities,
    totalProducts: products,
    users,
    consultants,
    leads,
    customers,
    deals,
    messages,
    appointments,
    activities,
    products,
  };
}

// ─── Deals by Pipeline ───────────────────────────────────
export async function getDealsByPipeline() {
  return db.pbizDeal.findMany({
    include: {
      customer: { select: { firstName: true, lastName: true } },
      assignedTo: { select: { firstName: true, lastName: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

// ─── Activities ──────────────────────────────────────────
export async function getRecentActivities(limit = 10) {
  return db.pbizActivity.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      customer: { select: { firstName: true, lastName: true } },
      user: { select: { firstName: true, lastName: true } },
    },
  });
}

// ─── Users ───────────────────────────────────────────────
export async function getAllUsers() {
  return db.pbizUser.findMany({
    select: { id: true, email: true, firstName: true, lastName: true, role: true, isOnline: true, avatarUrl: true },
    orderBy: { firstName: "asc" },
  });
}

// ─── Appointments ────────────────────────────────────────
export async function getUpcomingAppointments(limit = 5) {
  return db.pbizAppointment.findMany({
    where: { startTime: { gte: new Date() }, status: "SCHEDULED" },
    orderBy: { startTime: "asc" },
    take: limit,
    include: { customer: { select: { firstName: true, lastName: true } }, consultant: { select: { name: true } } },
  });
}

// ─── Tasks ───────────────────────────────────────────────
export async function getPendingTasks(limit = 5) {
  return db.pbizTask.findMany({
    where: { status: "PENDING" },
    orderBy: { dueDate: "asc" },
    take: limit,
    include: { customer: { select: { firstName: true, lastName: true } } },
  });
}

// ─── Leads ───────────────────────────────────────────────
export async function getLeads(filters?: { status?: string; temperature?: string }) {
  return db.pbizLead.findMany({
    where: { ...(filters?.status && { status: filters.status }), ...(filters?.temperature && { temperature: filters.temperature }) },
    orderBy: { createdAt: "desc" },
    include: {
      assignedTo: { select: { firstName: true, lastName: true } },
      consultant: { select: { name: true } },
      customer: { select: { firstName: true, lastName: true } },
    },
  });
}

export async function getLead(id: string) {
  return db.pbizLead.findUnique({
    where: { id },
    include: {
      assignedTo: { select: { firstName: true, lastName: true } },
      consultant: { select: { name: true, email: true } },
      customer: true,
      messages: { orderBy: { createdAt: "desc" }, take: 10 },
      tasks: { orderBy: { createdAt: "desc" } },
      followUps: { orderBy: { dueAt: "asc" } },
    },
  });
}

// ─── Customers ───────────────────────────────────────────
export async function getCustomers() {
  return db.pbizCustomer.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { orders: true, deals: true, leads: true } },
    },
  });
}

export async function getCustomer(id: string) {
  return db.pbizCustomer.findUnique({
    where: { id },
    include: {
      orders: { orderBy: { createdAt: "desc" }, take: 10 },
      deals: { orderBy: { updatedAt: "desc" } },
      activities: { orderBy: { createdAt: "desc" }, take: 15 },
      messages: { orderBy: { createdAt: "desc" }, take: 10 },
      appointments: { orderBy: { startTime: "desc" }, take: 5 },
      tasks: { orderBy: { createdAt: "desc" } },
      followUps: { orderBy: { dueAt: "asc" } },
    },
  });
}

// ─── Consultants ─────────────────────────────────────────
export async function getConsultants() {
  return db.pbizConsultant.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { leads: true, appointments: true, messages: true } },
    },
  });
}

// ─── Products / Inventory ────────────────────────────────
export async function getProducts(filter?: { category?: string }) {
  return db.pbizProduct.findMany({
    where: { ...(filter?.category && { category: filter.category }), isActive: true },
    orderBy: { name: "asc" },
  });
}

export async function getLowStockProducts() {
  const products = await db.pbizProduct.findMany({ where: { isActive: true } });
  return products.filter(p => p.stockQty <= p.lowStockAt);
}

// ─── Social ──────────────────────────────────────────────
export async function getSocialMentions(limit = 20) {
  return db.pbizSocialMention.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

// ─── Follow-Ups ──────────────────────────────────────────
export async function getOverdueFollowUps() {
  return db.pbizFollowUp.findMany({
    where: { status: "PENDING", dueAt: { lt: new Date() } },
    orderBy: { dueAt: "asc" },
    include: {
      customer: { select: { firstName: true, lastName: true } },
      lead: { select: { firstName: true, lastName: true } },
      consultant: { select: { name: true } },
    },
  });
}
