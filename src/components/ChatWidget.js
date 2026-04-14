"use client"
import { useState, useRef, useEffect } from "react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const widgetRef = useRef(null);

  // Sample auto-replies for demo
  const autoReplies = {
    "hello": "Hi there! 👋 How can I help you with FasterQ today?",
    "hi": "Hello! Welcome to FasterQ support. What can I do for you?",
    "pricing": "FasterQ starts at just ₹99/month. Would you like to know more about our features?",
    "feature": "FasterQ automatically logs SIM calls, tracks team performance, and gives you complete visibility!",
    "demo": "You can schedule a free demo with our team. Would you like me to help you book one?",
    "contact": "You can reach us at support@fasterq.in or call us at +91 97982 88748",
    "default": "Thanks for reaching out! Our team will get back to you soon. For immediate assistance, please check our FAQ section."
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Welcome message when widget opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([
          {
            role: "bot",
            text: "👋 Hi! Welcome to FasterQ. How can I assist you today?",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 500);
    }
  }, [isOpen]);

  function getAutoReply(userMsg) {
    const lowerMsg = userMsg.toLowerCase();
    
    if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) return autoReplies.hi;
    if (lowerMsg.includes("price") || lowerMsg.includes("cost") || lowerMsg.includes("₹")) return autoReplies.pricing;
    if (lowerMsg.includes("feature") || lowerMsg.includes("what")) return autoReplies.feature;
    if (lowerMsg.includes("demo")) return autoReplies.demo;
    if (lowerMsg.includes("contact") || lowerMsg.includes("email") || lowerMsg.includes("phone")) return autoReplies.contact;
    
    return autoReplies.default;
  }

  async function send() {
    if (!msg.trim()) return;

    const userMsg = {
      role: "user",
      text: msg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    setMsg("");
    setIsTyping(true);

    // Simulate API call or use auto-reply
    setTimeout(() => {
      const reply = getAutoReply(msg);
      const botMsg = {
        role: "bot",
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50" ref={widgetRef}>
      {/* Chat Widget Button */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-full p-4 shadow-2xl hover:shadow-xl transition-all hover:scale-110 animate-bounce" 
          style={{ animationDuration: '2s' }}
        >
          {/* Notification dot */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
          
          {/* Icon */}
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>

          {/* Tooltip */}
          <span className="absolute right-20 bottom-3 bg-gray-900 text-white text-sm py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Chat with us! 💬
            <span className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-900 rotate-45"></span>
          </span>
        </button>
      ) : (
        /* Chat Widget Window */
        <div className="w-[380px] sm:w-[420px] bg-white rounded-2xl shadow-2xl border border-orange-500/20 overflow-hidden animate-slideUp">
          
          {/* Widget Header */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                  </svg>
                </div>
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h3 className="font-bold text-white">FasterQ Support</h3>
                <p className="text-xs text-orange-100">Typically replies instantly</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="h-[400px] overflow-y-auto p-4 bg-[#FFF5EC]/30" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #FF5211 1px, transparent 0)',
            backgroundSize: '30px 30px',
            backgroundOpacity: '0.02'
          }}>
            <div className="space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}>
                  <div className={`flex items-start gap-2 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                    {/* Avatar */}
                    {m.role === "bot" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-600 to-orange-500 flex-shrink-0 flex items-center justify-center shadow-md">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                        </svg>
                      </div>
                    )}
                    
                    {/* Message Bubble */}
                    <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-md ${
                      m.role === "user"
                        ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none border border-orange-500/10"
                    }`}>
                      <p className="text-sm">{m.text}</p>
                      <p className={`text-[10px] mt-1 ${m.role === "user" ? "text-orange-100" : "text-gray-400"}`}>
                        {m.time}
                      </p>
                    </div>

                    {/* User Avatar */}
                    {m.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-md">
                        You
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-600 to-orange-500 flex-shrink-0 flex items-center justify-center shadow-md">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                      </svg>
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

          {/* Quick Actions */}
          <div className="px-4 py-2 border-t border-orange-500/10 bg-white/50">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {["Pricing", "Features", "Demo", "Contact"].map((action, i) => (
                <button
                  key={i}
                  onClick={() => setMsg(action)}
                  className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-500/20 rounded-full text-xs text-orange-700 whitespace-nowrap transition"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-orange-500/10">
            <div className="flex gap-2">
              <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Type your message..."
                className="flex-1 border border-orange-500/20 rounded-full px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 bg-[#FFF5EC]/30 text-sm"
              />
              <button
                onClick={send}
                disabled={!msg.trim()}
                className={`bg-gradient-to-r from-orange-600 to-orange-500 text-white p-3 rounded-full transition-all shadow-md hover:shadow-lg ${
                  !msg.trim() ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-[#FFF5EC] text-center text-xs text-gray-500 border-t border-orange-500/10">
            Powered by FasterQ • Usually replies in 5 mins
          </div>
        </div>
      )}
    </div>
  );
}