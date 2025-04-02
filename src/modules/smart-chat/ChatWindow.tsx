import { Button } from "@/components/ui/button";
import { useChatStream } from "@/lib/useChatStream";
import { BotMessageSquare, CircleX } from "lucide-react";
import { useState } from "react";

interface IChatWindow {
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatWindow: React.FC<IChatWindow> = ({ setIsChatOpen }) => {
  const { messages, sendMessage, isLoading } = useChatStream();
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    debugger;
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header (Fixed height) */}
      <div className="shrink-0 bg-gray-900 text-white px-4 py-2 text-sm font-semibold flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BotMessageSquare className="w-4 h-4" />
          <span>Asistente Virtual Inteligente</span>
        </div>
        <Button
          onClick={() => setIsChatOpen(false)}
          className="text-white hover:text-gray-300 p-1"
          size="icon"
          variant="ghost"
        >
          <CircleX className="w-5 h-5" />
        </Button>
      </div>

      {/* Scrollable message list */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 ${
              msg.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block px-4 py-2 rounded-xl text-sm ${
                msg.role === "user"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-black"
              }`}
            >
              {msg.content}
            </span>
          </div>
        ))}
      </div>

      {/* Footer input bar (Fixed height) */}
      <form
        onSubmit={handleSubmit}
        className="shrink-0 flex p-3 border-t border-gray-300"
      >
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
        />
        <button
          type="submit"
          className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
          disabled={isLoading}
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
