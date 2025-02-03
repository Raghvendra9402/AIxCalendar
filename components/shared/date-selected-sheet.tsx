import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

interface SheetProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  children: React.ReactNode;
}

export function DateSheet({ open, onOpenChange, children }: SheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="sr-only">title</SheetTitle>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}
