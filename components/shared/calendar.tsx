"use client";
import React, { useState } from "react";
import ReactCalendar from "react-calendar";
import { DateSheet } from "./date-selected-sheet";
import { EventForm } from "./event-form";
import { DateRecord } from "@prisma/client";
import { cn } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { useUser } from "@clerk/nextjs";

interface CalendarProps {
  initialData: DateRecord[];
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
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {date && isSheetOpen && (
        <DateSheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <div className="p-2 my-6">
            <h2 className="text-xl">Event Form</h2>
          </div>
          <EventForm date={date} userId={userId} />
        </DateSheet>
      )}
      <ReactCalendar
        className={cn(
          "REACT-CALENDAR p-2 w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
        )}
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
