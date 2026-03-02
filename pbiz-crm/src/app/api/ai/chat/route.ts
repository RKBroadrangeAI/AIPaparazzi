import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Built-in smart responses based on keywords
    const lowerMsg = message.toLowerCase();
    let reply: string;

    if (lowerMsg.includes("lead") && (lowerMsg.includes("top") || lowerMsg.includes("best") || lowerMsg.includes("today"))) {
      reply = "Based on your CRM data, I'd recommend focusing on leads with the highest lead scores. Check the Leads page sorted by score — leads from referrals and walk-ins typically have the highest conversion rates for fashion brands.";
    } else if (lowerMsg.includes("low stock") || lowerMsg.includes("inventory") || lowerMsg.includes("stock")) {
      reply = "Head to the Inventory page to see current stock levels. Products flagged as 'Low Stock' appear when quantity drops below the threshold. I'd suggest setting up reorder alerts for your best-selling categories like dresses and tops.";
    } else if (lowerMsg.includes("email") || lowerMsg.includes("follow-up") || lowerMsg.includes("draft")) {
      reply = "Here's a follow-up template for fashion customers:\n\nSubject: New Arrivals We Picked Just For You\n\nHi [Name],\n\nWe've got some exciting pieces that match your style preferences. Based on your recent consultations, I think you'll love our new [collection]. Would you like to schedule a private styling session?\n\nBest,\n[Your Name]\nPaparazziByBiz Style Team";
    } else if (lowerMsg.includes("conversion") || lowerMsg.includes("rate")) {
      reply = "For fashion CRM best practices, a healthy lead-to-customer conversion rate is typically 15-25%. You can improve this by:\n\n1. Personalizing outreach with style preferences\n2. Scheduling fitting appointments within 48h of first contact\n3. Sending lookbook photos tailored to their size profile\n4. Following up after events and collections drops";
    } else if (lowerMsg.includes("outfit") || lowerMsg.includes("pairing") || lowerMsg.includes("style")) {
      reply = "For spring collection pairings, I'd suggest:\n\n1. Urban Edge Hoodie + Flex Joggers — streetwear casual\n2. Velvet Drape Dress + statement accessories — evening events\n3. Structured Blazer + silk tops — client meetings\n4. Oversized knit + straight-leg denim — weekend smart casual\n\nYou can create deal bundles in the Deals section with 'Custom Order' pipeline.";
    } else if (lowerMsg.includes("deal") || lowerMsg.includes("pipeline")) {
      reply = "Your deal pipeline has four tracks: Retail (direct sales), Wholesale (bulk orders), Custom Order (bespoke pieces), and Event (fashion shows & pop-ups). Check the Deals page for a breakdown by stage. Focus on moving deals from Qualification to Proposal stage for quick wins.";
    } else if (lowerMsg.includes("hello") || lowerMsg.includes("hi") || lowerMsg.includes("hey")) {
      reply = "Hey there! 👋 I'm your PBiz AI assistant. I can help with:\n\n• Lead recommendations & scoring\n• Customer engagement tips\n• Inventory alerts & style pairings\n• Email templates & follow-ups\n• Pipeline analysis\n\nWhat would you like to know?";
    } else {
      reply = `Great question! As your PBiz fashion CRM assistant, I can help with lead management, customer engagement, inventory tracking, and deal optimization. For more specific insights, try asking about:\n\n• "What are today's top leads?"\n• "Show me low-stock items"\n• "Draft a follow-up email"\n• "Suggest outfit pairings"\n• "What's our conversion rate?"\n\nI'm continuously learning from your CRM data to give you better recommendations.`;
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
