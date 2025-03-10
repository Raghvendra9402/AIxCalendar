"use client";

import React from "react";
import { Button } from "../ui/button";
import { Bot, BotOff } from "lucide-react";
import { Chatbox } from "./chatbox";

export function ChatButton() {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        size={"icon"}
        variant={"outline"}
        title="Chatbox"
      >
        {isOpen ? (
          <BotOff className=" w-4 h-4" />
        ) : (
          <Bot className=" w-4 h-4" />
        )}
      </Button>
      <Chatbox open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
