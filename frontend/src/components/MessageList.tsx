import { useEffect, useRef } from "react";
import type { Message } from "../types";

interface Props {
  messages: Message[];
  loading: boolean;
}

export default function MessageList({ messages, loading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // 1) Nuevo: ¿estamos esperando el primer trozo de la respuesta?
  const last = messages[messages.length - 1];
  const waiting = loading && (!last || last.content === "");

  // Scroll automático al último mensaje (sin cambios)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        {messages.length === 0 && !loading && (
          <p className="mt-20 text-center text-brand-3">
            Hola, soy Jane. ¿En qué te ayudo?
          </p>
        )}

        {messages.map((m, i) => {
          // 2) Nuevo: no pintar burbujas vacías
          if (!m.content) return null;

          return (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2 ${
                  m.role === "user"
                    ? "bg-brand-2 text-brand-5"
                    : "border border-brand-4 bg-white text-brand-1"
                }`}
              >
                {m.content}
              </div>
            </div>
          );
        })}

        {/* 3) Cambiado: `loading` -> `waiting` */}
        {waiting && (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-brand-4 bg-white px-4 py-2 text-brand-3">
              Jane está escribiendo...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}