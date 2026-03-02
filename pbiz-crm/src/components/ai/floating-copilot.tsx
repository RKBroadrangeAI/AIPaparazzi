"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Shirt, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function FloatingCopilot() {
  const [open, setOpen] = useState(false);
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

    setMessages((p) => [...p, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: messages }),
      });
      const data = await res.json();
      setMessages((p) => [...p, { role: "assistant", content: data.reply || "I couldn't process that." }]);
    } catch {
      setMessages((p) => [...p, { role: "assistant", content: "Something went wrong." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full shadow-lg transition-all duration-300",
          open
            ? "bg-gray-800 hover:bg-gray-700"
            : "bg-[#C8658E] hover:bg-[#B8557E] hover:scale-110"
        )}
      >
        {open ? <X className="size-5 text-white" /> : <Sparkles className="size-5 text-white" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 bg-[#C8658E] px-4 py-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-white/20">
              <Shirt className="size-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">PBiz AI</p>
              <p className="text-[10px] text-white/70">Fashion CRM Assistant</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">
              <Minimize2 className="size-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-[340px] overflow-y-auto p-3 space-y-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-10 text-center">
                <Sparkles className="size-8 text-[#C8658E]/40" />
                <p className="text-xs text-gray-400">
                  Ask about leads, customers, inventory, or deals.
                </p>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[80%] rounded-xl px-3 py-2 text-xs",
                    m.role === "user"
                      ? "bg-[#C8658E] text-white"
                      : "bg-gray-100 text-gray-700"
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-xl bg-gray-100 px-3 py-2">
                  <div className="flex gap-1">
                    <span className="size-1.5 rounded-full bg-gray-400 animate-bounce" />
                    <span className="size-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                    <span className="size-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2 border-t border-gray-100 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask PBiz AI…"
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#C8658E] focus:ring-1 focus:ring-[#C8658E]/30"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex size-8 items-center justify-center rounded-lg bg-[#C8658E] text-white hover:bg-[#B8557E] disabled:opacity-50"
            >
              <Send className="size-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
