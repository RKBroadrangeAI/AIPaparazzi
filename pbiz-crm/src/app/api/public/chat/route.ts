import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const SYSTEM_PROMPT = `You are a friendly, helpful style assistant for Paparazzi by Biz — a women's fashion brand designed in Los Angeles. You help customers with:

- Finding the right styles from our S/S 2026 collection
- Sizing guidance (most styles S–XL, true to US sizing)
- Shipping info (1–2 day processing, 3–5 day delivery, free over $100)
- Returns (hassle-free 30-day return policy)
- Styling tips and outfit pairing suggestions
- New arrivals and current collections
- Product details: embroidered tops, reversible jackets, coordinates, resort wear, dresses

Keep responses warm, concise, and shopper-friendly. Use emojis sparingly for warmth. If you don't know something specific, suggest the customer contact info@paparazzibybiz.com or call (213) 748-2900.`;

function getXAIClient(): OpenAI | null {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({
    apiKey,
    baseURL: "https://api.x.ai/v1",
  });
}

// Public chatbot endpoint for B2C website (no auth required)
export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const xai = getXAIClient();

    if (xai) {
      const messages: OpenAI.ChatCompletionMessageParam[] = [
        { role: "system", content: SYSTEM_PROMPT },
      ];

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
        max_tokens: 512,
        temperature: 0.7,
      });

      const reply = completion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";
      return NextResponse.json({ reply });
    }

    // Fallback when no API key
    return NextResponse.json({
      reply: "Thanks for reaching out! Our team is here to help. Email us at info@paparazzibybiz.com or call (213) 748-2900 for personalized assistance. 💕",
    });
  } catch (error) {
    console.error("Public chat error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
