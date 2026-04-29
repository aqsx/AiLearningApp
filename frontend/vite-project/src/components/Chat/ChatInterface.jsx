import React, { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, Sparkles } from "lucide-react";
import { useParams } from "react-router-dom";
import aiService from "../../services/aiService";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../common/Spinner";
import MarkdownRenderer from "../common/MarkdownRenderer";

const ChatInterface = () => {
  const { id: documentId } = useParams();
  const { user } = useAuth();

  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

 
  const extractAIText = (res) => {
    console.log("🔥 FULL AI RESPONSE:", res);

    return (
      res?.data?.answer ||
      res?.data?.response ||
      res?.data?.message ||
      res?.data ||
      res?.answer ||
      res?.response ||
      res?.message ||
      "No response"
    );
  };


  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await aiService.getChatHistory(documentId);

        const messages = Array.isArray(response)
          ? response.flatMap((chat) => chat.messages || [])
          : [];

        setHistory(messages);
      } catch (error) {
        console.error("❌ CHAT HISTORY ERROR:", error);
        setHistory([]);
      } finally {
        setInitialLoading(false);
      }
    };

    if (documentId) fetchChatHistory();
  }, [documentId]);

  useEffect(() => {
    scrollToBottom();
  }, [history, loading]);

  /* ===========================
     SEND MESSAGE
  =========================== */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await aiService.chatWithAI(
        documentId,
        userMessage.content
      );

      const aiText = response?.answer || "No response";

      const assistantMessage = {
        role: "assistant",
        content:
          typeof aiText === "string"
            ? aiText
            : JSON.stringify(aiText, null, 2),
        timestamp: new Date(),
      };

      setHistory((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("❌ CHAT ERROR:", error);

      setHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* ===========================
     RENDER MESSAGE
  =========================== */
  const renderMessage = (msg, index) => {
    const isUser = msg.role === "user";

    return (
      <div
        key={index}
        className={`flex gap-3 my-4 ${isUser ? "justify-end" : ""}`}
      >
        {!isUser && (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        )}

        <div
          className={`max-w-lg p-4 text-sm rounded-2xl shadow-sm ${
            isUser
              ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-br-md"
              : "bg-white/80 backdrop-blur-md text-slate-700 rounded-bl-md"
          }`}
        >
          {isUser ? (
            msg.content
          ) : (
            <MarkdownRenderer content={msg.content} />
          )}
        </div>

        {isUser && (
          <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center text-sm font-semibold">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
      </div>
    );
  };

  
  if (initialLoading) {
    return (
      <div className="flex flex-col h-[70vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  /* ===========================
     UI
  =========================== */
  return (
    <div className="flex flex-col h-[70vh] bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm overflow-hidden">

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto">
        {history.length === 0 ? (
          <div className="text-center text-slate-500 mt-20">
            <MessageSquare className="mx-auto mb-2" />
            Ask something about your document
          </div>
        ) : (
          history.map(renderMessage)
        )}

        {loading && (
          <p className="text-sm text-slate-400 mt-2">
            AI is thinking...
          </p>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white/70 backdrop-blur-md">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-3 bg-white rounded-xl shadow px-3 py-2"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask something..."
            className="flex-1 bg-transparent outline-none text-sm"
          />

          <button
            type="submit"
            disabled={!message.trim()}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:scale-105 transition"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;

