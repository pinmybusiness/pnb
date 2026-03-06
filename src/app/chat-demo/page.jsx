"use client"
import { useState, useRef, useEffect } from "react";

export default function ChatDemo() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function send() {
    if (!msg.trim()) return;

    const userMsg = { role: "user", text: msg };
    setMessages(prev => [...prev, userMsg]);
    setMsg("");
    setIsTyping(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text })
      });

      const data = await res.json();
      const botMsg = { role: "bot", text: data.reply };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg = { role: "bot", text: "Sorry, I'm having trouble connecting. Please try again." };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div className="relative bg-gradient-to-br from-[#FFF5EC] via-orange-50/40 to-white min-h-screen py-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated background elements - matching Trackly theme */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-[#FF5211]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-orange-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-orange-200/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Decorative grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(#FF5211 1px, transparent 1px), linear-gradient(90deg, #FF5211 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-4 h-4 bg-[#FF5211]/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }}></div>
        <div className="absolute top-1/3 right-20 w-3 h-3 bg-orange-400/20 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-5 h-5 bg-[#FF5211]/15 rounded-full animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3.5s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-full border border-orange-500/20 shadow-lg">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-orange-600 font-semibold tracking-wide text-sm">
              ✨ AI-Powered Support
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold mt-6">
            <span className="text-gray-900">Ask </span>
            <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent">
              FasterQ Assistant
            </span>
          </h1>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Get instant answers about FasterQ features, pricing, and implementation
          </p>
        </div>

        {/* Chat Container */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-orange-500/10 overflow-hidden">
          {/* Chat Header */}
          <div className="px-6 py-5 border-b border-orange-500/10 bg-gradient-to-r from-[#FFF5EC] to-white flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                FQ
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h2 className="font-bold text-xl text-gray-900">FasterQ Assistant</h2>
              <div className="flex items-center gap-2 text-sm">
                <span className="flex items-center gap-1 text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Online
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500">Typically replies instantly</span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-[400px] overflow-y-auto p-6 bg-[#FFF5EC]/30" style={{ 
            backgroundImage: 'radial-gradient(circle at 1px 1px, #FF5211 1px, transparent 0)',
            backgroundSize: '40px 40px',
            backgroundOpacity: '0.02'
          }}>
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full min-h-[300px]">
                  <div className="text-center max-w-sm">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-600/20 to-orange-500/20 flex items-center justify-center">
                      <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">How can I help you today?</h3>
                    <p className="text-gray-500 text-sm">
                      Ask me anything about FasterQ — features, pricing, integrations, or implementation
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                      {["What is FasterQ?", "Pricing plans?", "Features?", "Demo?"].map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setMsg(suggestion);
                          }}
                          className="px-3 py-1.5 bg-white border border-orange-500/20 rounded-full text-sm text-gray-700 hover:border-orange-500 hover:bg-orange-50 transition"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}>
                  <div className={`flex items-start gap-2 max-w-[80%] ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                    {m.role === "bot" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-600 to-orange-500 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-md">
                        AI
                      </div>
                    )}
                    <div className={`px-4 py-3 rounded-2xl text-sm shadow-md ${
                      m.role === "user"
                        ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none border border-orange-500/10"
                    }`}>
                      {m.text}
                    </div>
                    {m.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-md">
                        You
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-600 to-orange-500 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-md">
                      AI
                    </div>
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-orange-500/10 shadow-md">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                        <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        <span className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-orange-500/10">
            <div className="flex gap-3">
              <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Type your message..."
                className="flex-1 border border-orange-500/20 rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 bg-[#FFF5EC]/30 text-gray-800 placeholder-gray-400"
              />
              <button
                onClick={send}
                disabled={!msg.trim()}
                className={`bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-3.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 ${
                  !msg.trim() ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <span>Send</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">
              Powered by AI • Responses may take a few seconds
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
} 