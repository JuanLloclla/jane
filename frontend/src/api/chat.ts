import axios from "axios";
import type { Message } from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
});

export const getHistory = async (): Promise<Message[]> => {
  const { data } = await api.get<Message[]>("/chat");
  return data;
};

export const sendMessage = async (message: string): Promise<string> => {
  const { data } = await api.post<{ reply: string }>("/chat", { message });
  return data.reply;
};

export const newChat = async (): Promise<void> => {
  await api.post("/chat/nuevo");
};

export const streamMessage = async (
  message: string,
  onChunk: (text: string) => void,
): Promise<void> => {
  const res = await fetch(`${API_URL}/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!res.ok || !res.body) throw new Error("Error en el streaming");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value, { stream: true }));
  }
};