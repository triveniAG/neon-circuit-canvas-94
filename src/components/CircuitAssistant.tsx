import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Trash2, Cpu } from "lucide-react";
import { useCircuitChat } from "@/hooks/useCircuitChat";
import { cn } from "@/lib/utils";

const CircuitAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, isLoading, sendMessage, clearMessages } = useCircuitChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput("");
  };

  return (
    <>
      {/* Floating button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg",
          "bg-primary hover:bg-primary/90 text-primary-foreground",
          "transition-all duration-300 hover:scale-105",
          isOpen && "hidden"
        )}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat panel */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]",
          "bg-card border border-border rounded-2xl shadow-2xl",
          "flex flex-col overflow-hidden transition-all duration-300",
          isOpen ? "h-[500px] opacity-100" : "h-0 opacity-0 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Cpu className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Circuit Assistant</h3>
              <p className="text-xs text-muted-foreground">Ask about components</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={clearMessages}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Cpu className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Ask me anything about electronic components!</p>
              <div className="mt-4 space-y-2">
                {["What is a capacitor?", "How do resistor color codes work?", "Explain transistors"].map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="block w-full text-left text-xs p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2 text-sm",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce delay-100" />
                      <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about electronics..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CircuitAssistant;
