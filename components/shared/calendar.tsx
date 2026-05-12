"use client";
import { useMonthEvents } from "@/hooks/useEvents";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useState } from "react";
import ReactCalendar from "react-calendar";
import { DateSheet } from "./date-selected-sheet";
import { EventForm } from "./event-form";

interface CalendarProps {
  userId: string;
}

export function Calendar({ userId }: CalendarProps) {
  const { isSignedIn } = useUser();
  const [date, setDate] = useState<Date | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { data: monthEvents = [] } = useMonthEvents();

  function handleDate(selectedDate: Date) {
    if (!isSignedIn) {
      redirect("/sign-in");
    }
    setDate(selectedDate);
    setIsSheetOpen(true);
  }
  return (
    <div className="w-full max-h-screen max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {date && isSheetOpen && (
        <DateSheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <EventForm date={date} userId={userId} />
        </DateSheet>
      )}
      <ReactCalendar
        className={cn(
          "REACT-CALENDAR p-2 w-full mx-auto bg-white shadow-lg rounded-lg overflow-auto",
        )}
        tileClassName={({ date }) => {
          const isEventDate = monthEvents.some(
            (eventDate) =>
              new Date(eventDate.date).toDateString() === date.toDateString(),
          );
          return cn(isEventDate ? "event-date" : "");
        }}
        tileContent={({ date }) => {
          const events = monthEvents.filter(
            (eventDate) =>
              new Date(eventDate.date).toDateString() === date.toDateString(),
          );
          if (!events.length) return null;
          return (
            <div className="flex flex-col items-center">
              {events.slice(0, 2).map((event, i) => (
                <p
                  key={i}
                  className="pt-2 text-[8px] leading-tight truncate w-full text-center"
                >
                  {event.events[0].eventName}
                </p>
              ))}
              {events.length > 2 && (
                <p className="text-[8px] text-white/70">
                  +{events.length - 2} more
                </p>
              )}
            </div>
          );
        }}
        view="month"
        onClickDay={handleDate}
      />
    </div>
  );
}
