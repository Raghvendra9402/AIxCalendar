"use client";

import { Bot, BotOff } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Chatbox } from "./chatbox";

export function ChatButton() {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Button
        onClick={() => setIsOpen((prev) => !prev)}
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
