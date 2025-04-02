import { useState, useCallback, useEffect } from "react";

export type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
};

export const useChatStream = (
  messageEndRef: React.RefObject<HTMLDivElement | null>,
  inputRef: React.RefObject<HTMLInputElement | null>
) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "¡Hola! 👋 Soy tu asistente virtual de Bungalow Paradise. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);

  // Auto-scroll on new message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (userMessage: string) => {
      debugger;
      const updatedMessages: Message[] = [
        ...messages,
        { role: "user", content: userMessage, timestamp: new Date() },
      ];

      setMessages(updatedMessages);
      setIsLoading(true);

      const res = await fetch(
        "https://localhost:44353/api/SmartAIChat/stream",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: updatedMessages }),
        }
      );

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      const assistantIndex = updatedMessages.length;

      if (reader) {
        setIsAssistantTyping(true);
        const newMessages: Message[] = [
          ...updatedMessages,
          { role: "assistant", content: "", timestamp: new Date() },
        ];
        setMessages(newMessages);

        let done = false;
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            const chunk = decoder.decode(value);
            assistantMessage += chunk;

            // Animate text update
            setMessages((prev) => {
              const updated = [...prev];
              updated[assistantIndex] = {
                role: "assistant",
                content: assistantMessage,
                timestamp: new Date(),
              };
              return updated;
            });
          }
        }
      }
      setIsAssistantTyping(false);
      setIsLoading(false);
      inputRef.current?.focus();
    },
    [messages]
  );

  return {
    messages,
    isLoading,
    sendMessage,
    setMessages,
    isAssistantTyping
  };
};
