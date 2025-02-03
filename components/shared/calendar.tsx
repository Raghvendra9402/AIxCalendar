"use client";
import React, { useState } from "react";
import ReactCalendar from "react-calendar";
import { DateSheet } from "./date-selected-sheet";
import { EventForm } from "./event-form";
import { Date as PrismaDate } from "@prisma/client";
import { cn } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { useUser } from "@clerk/nextjs";

interface CalendarProps {
  initialData: PrismaDate[];
  userId: string;
}

export function Calendar({ initialData, userId }: CalendarProps) {
  const { isSignedIn } = useUser();
  const [date, setDate] = useState<Date | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  React.useEffect(() => {
    if (date) {
      console.log(date.toDateString());
    }
  }, [date]);

  function handleDate(selectedDate: Date) {
    if (!isSignedIn) {
      redirect("/sign-in");
    }
    setDate(selectedDate);
    setIsSheetOpen(true);
  }
  return (
    <div>
      {date && isSheetOpen && (
        <DateSheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <div className="p-2 my-6">
            <h2 className="text-xl">Event Form</h2>
          </div>
          <EventForm date={date} initialData={initialData} userId={userId} />
        </DateSheet>
      )}
      <ReactCalendar
        className={cn("REACT-CALENDAR p-2")}
        tileClassName={({ date }) => {
          const isEventDate = initialData.some(
            (eventDate) =>
              new Date(eventDate.date).toDateString() === date.toDateString()
          );
          return cn(isEventDate ? "event-date" : "");
        }}
        view="month"
        onClickDay={handleDate}
      />
    </div>
  );
}
