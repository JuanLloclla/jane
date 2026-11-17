import { useEffect, useState } from "react";
import { getHistory, newChat, sendMessage } from "./api/chat";
import MessageInput from "./components/MessageInput";
import MessageList from "./components/MessageList";
import type { Message } from "./types";

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Al abrir la app, carga la conversación actual del backend
  useEffect(() => {
    getHistory()
      .then(setMessages)
      .catch(() => setError("No se pudo conectar con el backend."));
  }, []);

  const handleSend = async (text: string) => {
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const reply = await sendMessage(text);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setError("Jane no pudo responder. Revisa la terminal del backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = async () => {
    try {
      await newChat();
      setMessages([]);
      setError(null);
    } catch {
      setError("No se pudo crear un nuevo chat.");
    }
  };

  return (
    <div className="flex h-screen flex-col bg-brand-5">
      <header className="flex items-center justify-between bg-brand-1 px-4 py-3 text-brand-5">
        <h1 className="text-lg font-semibold">Jane</h1>
        <button
          onClick={handleNewChat}
          disabled={loading}
          className="rounded-lg bg-brand-2 px-3 py-1 text-sm transition hover:bg-brand-3 disabled:opacity-50"
        >
          Nuevo chat
        </button>
      </header>

      <MessageList messages={messages} loading={loading} />

      {error && (
        <p className="bg-red-100 px-4 py-2 text-center text-sm text-red-700">
          {error}
        </p>
      )}

      <MessageInput onSend={handleSend} disabled={loading} />
    </div>
  );
}