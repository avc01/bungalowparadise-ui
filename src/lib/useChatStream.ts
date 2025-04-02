import { useState, useCallback } from "react";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export const useChatStream = () => {
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: "Welcome to BungalowParadise! I'm your virtual assistant. How can I help you today?"}]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (userMessage: string) => {
    debugger;
    const updatedMessages: Message[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];

    setMessages(updatedMessages);
    setIsLoading(true);

    const res = await fetch("https://localhost:44353/api/SmartAIChat/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updatedMessages }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let assistantMessage = "";

    if (reader) {
      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          assistantMessage += chunk;

          // Optional: Update partial response (live typing)
          setMessages([
            ...updatedMessages,
            { role: "assistant", content: assistantMessage },
          ]);
        }
      }
    }

    setIsLoading(false);
  }, [messages]);

  return {
    messages,
    isLoading,
    sendMessage,
    setMessages,
  };
};
