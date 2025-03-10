"use client";
import { cn } from "@/lib/utils";
import { Message, useChat } from "ai/react";
import { Button } from "../ui/button";
import { Bot, Send, Trash, User, X } from "lucide-react";
import { Input } from "../ui/input";
import React from "react";

interface ChatboxProps {
  open: boolean;
  onClose: () => void;
}

export function Chatbox({ open, onClose }: ChatboxProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    setMessages,
  } = useChat();
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
  return (
    <div
      className={cn(
        "bottom-0 left-0 z-50 w-[500px] p-1 xl:left-36",
        open ? "fixed" : "hidden"
      )}
    >
      <>
        <div className="p-2 flex h-[500px] flex-col rounded-md border bg-slate-100">
          <div className=" p-2 flex items-center justify-between mb-2">
            <h2 className="text-xl">Chatbox</h2>
            <Button onClick={onClose} variant={"ghost"} size={"icon"}>
              <X />
            </Button>
          </div>
          <div className="mt-2 h-full overflow-y-auto" ref={scrollRef}>
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
                  content: "Try Again...",
                }}
              />
            )}
          </div>
          <form
            onSubmit={handleSubmit}
            className="m-3 flex gap-x-2 items-center"
          >
            <Button
              className="flex flex-none items-center justify-center"
              title="Clear Chat"
              type="button"
              onClick={() => setMessages([])}
            >
              <Trash />
            </Button>
            <Input
              value={input}
              onChange={handleInputChange}
              ref={inputRef}
              className="bg-white"
            />
            <Button type="submit">
              <Send />
            </Button>
          </form>
        </div>
      </>
    </div>
  );
}

interface ChatMessageProps {
  message: Message;
}

function ChatMessage({ message: { role, content } }: ChatMessageProps) {
  const isAI = role === "assistant";
  return (
    <div
      className={cn(
        "mb-3 flex items-center",
        isAI ? "me-5 justify-start" : "ms-5 justify-end"
      )}
    >
      {isAI ? (
        <Bot className="mr-2 flex-none" />
      ) : (
        <User className="mr-2 flex-none" />
      )}
      <div
        className={cn(
          "rounded-md border px-3 py-2",
          isAI ? "bg-background" : "bg-foreground text-background"
        )}
      >
        {content}
      </div>
    </div>
  );
}
