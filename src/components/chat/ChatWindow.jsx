import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { hexToRgb } from "../../utils/hexToRgb.js";

const ChatWindow = ({ activeUser, messages, onSendMessage }) => {
  const [inputText, setInputText] = useState("");
  const ACCENT = useSelector((state) => state.theme.accent);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText("");
    }
  };

  if (!activeUser) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-background/50">
        <div className="text-center p-8 border border-dashed border-line rounded-lg">
          <h3
            className="font-family-display text-xl mb-4"
            style={{ color: ACCENT }}
          >
            SELECT_A_CHANNEL
          </h3>
          <p className="font-family-mono text-muted text-sm">
            INITIALIZE SECURE UPLINK TO START CHATTING
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col bg-background/50">
      {/* Header */}
      <div className="p-4 border-b border-line flex items-center gap-4 bg-surface/50 backdrop-blur-md sticky top-0 z-10">
        <div className="w-10 h-10 sm:hidden invisible" />{" "}
        {/* Placeholder for mobile back btn space */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-black flex-shrink-0"
          style={{ background: ACCENT }}
        >
          {activeUser.username[0].toUpperCase()}
        </div>
        <div className="flex flex-col">
          <h2
            className="font-family-display text-lg tracking-wider"
            style={{ color: ACCENT }}
          >
            {activeUser.username}
          </h2>
          <span className="text-[10px] text-green-500 font-family-mono">
            SECURED
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg font-family-mono text-sm shadow-lg`}
              style={{
                background: msg.isMe ? ACCENT : "rgba(37, 37, 53, 0.8)",
                color: msg.isMe ? "black" : "white",
                border: !msg.isMe ? `1px solid ${ACCENT}` : "none",
              }}
            >
              <div className="flex flex-col gap-1">
                <span>{msg.text}</span>
                <span
                  className={`text-[10px] self-end opacity-60`}
                  style={{ color: msg.isMe ? "black" : ACCENT }}
                >
                  {msg.timestamp || "12:00"}
                </span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form
        onSubmit={handleSend}
        className="p-4 border-t border-line bg-surface/50"
      >
        <div className="flex gap-4">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your encrypted message..."
            className="flex-1 bg-background border border-line rounded p-3 text-white font-family-mono text-sm focus:outline-none focus:border-opacity-100"
            style={{ borderColor: `rgba(${hexToRgb(ACCENT)}, 0.3)` }}
          />
          <button
            type="submit"
            className="px-6 py-2 font-family-display text-xs font-bold tracking-widest text-black transition-all hover:scale-105 active:scale-95"
            style={{ background: ACCENT }}
          >
            SEND
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
