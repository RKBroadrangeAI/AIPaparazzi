import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import OpenAI from "openai";

const SYSTEM_PROMPT = `You are the AI assistant for PaparazziByBiz CRM — a wholesale women's fashion brand designed in Los Angeles. You help sales consultants and managers with:

- Lead management, scoring, and follow-up strategies
- Customer engagement and relationship tips
- Inventory tracking, low-stock alerts, and reorder suggestions
- Deal pipeline analysis (Retail, Wholesale, Custom Order, Event)
- Outfit pairing and styling advice for clients
- Email templates and follow-up messaging
- Trade show prep (Atlanta Apparel Market, Trendz)
- S/S 2026 collection highlights: embroidered details, reversible jackets, coordinates, resort wear

Keep responses concise, actionable, and fashion-industry focused. Use emojis sparingly for warmth. Format longer responses with bullet points or numbered lists.`;

function getXAIClient(): OpenAI | null {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({
    apiKey,
    baseURL: "https://api.x.ai/v1",
  });
}

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

    const xai = getXAIClient();

    // If xAI API key is configured, use Grok
    if (xai) {
      const messages: OpenAI.ChatCompletionMessageParam[] = [
        { role: "system", content: SYSTEM_PROMPT },
      ];

      // Include recent chat history for context (last 10 messages)
      if (Array.isArray(history)) {
        for (const h of history.slice(-10)) {
          if (h.role === "user" || h.role === "assistant") {
            messages.push({ role: h.role, content: h.content });
          }
        }
      }

      messages.push({ role: "user", content: message });

      const completion = await xai.chat.completions.create({
        model: "grok-3-mini-fast",
        messages,
        max_tokens: 1024,
        temperature: 0.7,
      });

      const reply = completion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";
      return NextResponse.json({ reply });
    }

    // Fallback: Built-in smart responses when no API key is set
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
      reply = "For S/S 2026 pairings, I'd suggest:\n\n1. Reversible Floral Jacket + Embroidered Wide-Leg Pants — chic daytime\n2. Romantic Rose Maxi Dress + Lace-Trim Cardigan — evening events\n3. Floral Embroidered Tee + Boho Skirt — weekend casual\n4. Ruffle Sleeve Coordinates Set — effortless head-to-toe styling\n\nYou can create deal bundles in the Deals section with 'Custom Order' pipeline.";
    } else if (lowerMsg.includes("deal") || lowerMsg.includes("pipeline")) {
      reply = "Your deal pipeline has four tracks: Retail (direct sales), Wholesale (bulk orders), Custom Order (bespoke pieces), and Event (fashion shows & pop-ups). Check the Deals page for a breakdown by stage. Focus on moving deals from Qualification to Proposal stage for quick wins.";
    } else if (lowerMsg.includes("hello") || lowerMsg.includes("hi") || lowerMsg.includes("hey")) {
      reply = "Hey there! 👋 I'm your PBiz AI assistant. I can help with:\n\n• Lead recommendations & scoring\n• Customer engagement tips\n• Inventory alerts & style pairings\n• Email templates & follow-ups\n• Pipeline analysis\n\nWhat would you like to know?";
    } else {
      reply = `Great question! As your PBiz fashion CRM assistant, I can help with lead management, customer engagement, inventory tracking, and deal optimization. Try asking about:\n\n• "What are today's top leads?"\n• "Show me low-stock items"\n• "Draft a follow-up email"\n• "Suggest outfit pairings"\n• "What's our conversion rate?"\n\nI'm here to help you close more deals!`;
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
