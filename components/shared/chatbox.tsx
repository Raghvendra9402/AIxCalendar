"use client";
import { cn } from "@/lib/utils";
import { Message, useChat } from "@ai-sdk/react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { Bot, Send, Trash, User, X } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface ChatboxProps {
  open: boolean;
  onClose: () => void;
}

export function Chatbox({ open, onClose }: ChatboxProps) {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const queryClient = useQueryClient();
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    setMessages,
  } = useChat({
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === "create_event") {
        await queryClient.invalidateQueries({
          queryKey: ["month-events"],
        });
      }
    },
  });
  const lastMessageFromUser = messages[messages.length - 1]?.role === "user";
  const inputRef = React.useRef<HTMLInputElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  React.useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  // const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (isSignedIn) {
  //     handleSubmit(e);
  //   } else {
  //     openSignIn();
  //   }
  // };

  return (
    <div
      className={cn("fixed bottom-4 right-4 z-50 w-[500px]", !open && "hidden")}
      style={{ maxHeight: "calc(100vh - 2rem)" }}
    >
      <div
        className="flex h-[500px] flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl"
        style={{ maxHeight: "calc(100vh - 2rem)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-3">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <h2 className="text-sm font-semibold tracking-wide">
              AI Assistant
            </h2>
          </div>

          <Button onClick={onClose} variant="ghost" size="icon">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <div
          className="flex-1 space-y-4 overflow-y-auto bg-background/50 p-4 min-h-0"
          ref={scrollRef}
        >
          {messages.map((message) => (
            <ChatMessage message={message} key={message.id} />
          ))}

          {isLoading && lastMessageFromUser && (
            <ChatMessage
              message={{
                id: "loading",
                role: "assistant",
                content: "Thinking...",
              }}
            />
          )}

          {error && lastMessageFromUser && (
            <ChatMessage
              message={{
                id: "error",
                role: "assistant",
                content: "Something went wrong. Try again.",
              }}
            />
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t bg-background p-3"
        >
          <Button
            type="button"
            title="Clear Chat"
            variant="outline"
            size="icon"
            onClick={() => setMessages([])}
          >
            <Trash className="h-4 w-4" />
          </Button>

          <Input
            value={input}
            onChange={handleInputChange}
            ref={inputRef}
            placeholder="Ask something..."
            className="bg-background"
          />

          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

interface ChatMessageProps {
  message: Message;
}

function ChatMessage({ message: { role, content } }: ChatMessageProps) {
  const isAI = role === "assistant";
  return (
    <div className={cn("flex w-full", isAI ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "flex max-w-[85%] items-start gap-2",
          !isAI && "flex-row-reverse",
        )}
      >
        <div
          className={cn(
            "mt-1 flex h-8 w-8 items-center justify-center rounded-full border",
            isAI
              ? "bg-muted text-muted-foreground"
              : "bg-primary text-primary-foreground",
          )}
        >
          {isAI ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
        </div>

        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm shadow-sm",
            isAI
              ? "border bg-muted text-foreground"
              : "bg-primary text-primary-foreground",
          )}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
