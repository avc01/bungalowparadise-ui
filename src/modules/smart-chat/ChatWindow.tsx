import { Button } from "@/components/ui/button";
import { useChatStream } from "@/lib/useChatStream";
import { BotMessageSquare, CircleX, Maximize2, Minimize2 } from "lucide-react";
import { useRef, useState } from "react";

interface IChatWindow {
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatWindow: React.FC<IChatWindow> = ({
  setIsChatOpen,
  isExpanded,
  setIsExpanded,
}) => {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, isLoading, isAssistantTyping } = useChatStream(
    messageEndRef,
    inputRef
  );
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-background border border-border rounded-xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="shrink-0 bg-muted/80 backdrop-blur px-4 py-2 border-b border-border text-sm font-semibold flex justify-between items-center">
        <div className="flex items-center gap-2 text-primary">
          <BotMessageSquare className="w-4 h-4" />
          <span>Asistente Virtual</span>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsExpanded((prev) => !prev)}
            size="icon"
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            {isExpanded ? <Minimize2 /> : <Maximize2 />}
          </Button>
          <Button
            onClick={() => setIsChatOpen(false)}
            size="icon"
            variant="ghost"
            className="text-muted-foreground hover:text-destructive"
          >
            <CircleX className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 text-sm">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <span
              className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl whitespace-pre-line ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground animate-fade-in"
              }`}
            >
              {msg.content}
              {msg.timestamp && (
                <div className="text-[10px] text-muted-foreground mt-1 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </span>
          </div>
        ))}
        {isAssistantTyping && (
          <div className="text-left text-muted-foreground text-sm italic animate-pulse">
            El asistente está escribiendo...
          </div>
        )}
        <div ref={messageEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="shrink-0 flex items-center gap-2 border-t border-border bg-background px-4 py-3"
      >
        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-muted border border-border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
        />
        <Button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/90 transition"
          disabled={isLoading}
        >
          Enviar
        </Button>
      </form>
    </div>
  );
};

export default ChatWindow;
