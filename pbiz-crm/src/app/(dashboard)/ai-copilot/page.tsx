"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, User, Bot, Shirt } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "What are today's top leads?",
  "Show me low-stock inventory items",
  "Draft a follow-up email for new customers",
  "What's our conversion rate this month?",
  "Suggest outfit pairings for spring collection",
  "Summarize this week's deal pipeline",
];

export default function AiCopilotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: messages }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply || "I couldn't process that. Try again." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-gray-900">AI Copilot</h1>
        <p className="text-sm text-gray-500">Your fashion CRM assistant powered by AI</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Card className="border-none shadow-sm flex flex-col" style={{ height: "calc(100vh - 220px)" }}>
            <CardContent className="flex flex-1 flex-col p-0">
              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center gap-4 py-16 text-center">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-[#C8658E]/10">
                      <Sparkles className="size-8 text-[#C8658E]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">PBiz AI Assistant</p>
                      <p className="text-xs text-gray-400 mt-1 max-w-md">
                        Ask me anything about your leads, customers, deals, inventory, or fashion trends.
                        I can help with data analysis, email drafts, and outfit recommendations.
                      </p>
                    </div>
                  </div>
                )}

                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}
                  >
                    {m.role === "assistant" && (
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#C8658E]/10">
                        <Shirt className="size-4 text-[#C8658E]" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[70%] rounded-2xl px-4 py-2.5 text-sm",
                        m.role === "user"
                          ? "bg-[#C8658E] text-white"
                          : "bg-gray-100 text-gray-800"
                      )}
                    >
                      {m.content}
                    </div>
                    {m.role === "user" && (
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-200">
                        <User className="size-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#C8658E]/10">
                      <Shirt className="size-4 text-[#C8658E]" />
                    </div>
                    <div className="rounded-2xl bg-gray-100 px-4 py-2.5">
                      <div className="flex gap-1">
                        <span className="size-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                        <span className="size-2 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                        <span className="size-2 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>

              {/* Input */}
              <div className="border-t border-gray-100 p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about leads, customers, inventory, deals..."
                    className="flex-1"
                    disabled={loading}
                  />
                  <Button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="bg-[#C8658E] hover:bg-[#B8557E] px-4"
                  >
                    <Send className="size-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Suggestions sidebar */}
        <div className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Quick Prompts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(s); }}
                  className="w-full rounded-lg border border-gray-100 px-3 py-2 text-left text-xs text-gray-600 hover:bg-[#C8658E]/5 hover:border-[#C8658E]/20 transition-colors"
                >
                  {s}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
