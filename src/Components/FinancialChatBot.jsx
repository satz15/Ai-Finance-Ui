import React, { useState } from "react";
import { Send, MessageCircle, X, Loader2 } from "lucide-react";

const FinancialChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", text: "👋 Hi! I’m your AI Financial Coach. Ask me anything about your finances." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
      const data = await res.json();
      const aiMessage = {
        role: "ai",
        text: data.response || "No response received.",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "⚠️ Error connecting to AI. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-7 h-7" />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-50 animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 py-3 flex items-center justify-between">
            <h3 className="font-bold text-lg">AI Financial Coach</h3>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-96 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl text-sm shadow-sm max-w-[80%] ${
                  msg.role === "user"
                    ? "ml-auto bg-gradient-to-br from-blue-100 to-indigo-100 text-gray-800"
                    : "mr-auto bg-gradient-to-br from-slate-50 to-gray-100 text-gray-900"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-3 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask a question..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-2 rounded-full hover:scale-105 transition-transform disabled:opacity-60"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FinancialChatBot;
