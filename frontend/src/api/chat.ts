import axios from "axios";
import type { Message } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000",
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