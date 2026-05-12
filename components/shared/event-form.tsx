"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import GetEvents from "./get-events";

const formSchema = z.object({
  eventDate: z.date(),
  eventName: z.string().min(1, {
    message: "event required",
  }),
});

interface EventFormProps {
  date: Date;
  userId: string;
}

export function EventForm({ date, userId }: EventFormProps) {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const toggleCreating = () => setIsCreating(!isCreating);
  const inputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventDate: date!,
      eventName: "",
    },
  });
  const { isValid, isSubmitting } = form.formState;
  React.useEffect(() => {
    if (isCreating) {
      inputRef.current?.focus();
    }
  }, [isCreating]);
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(userId);
      const eventData = {
        eventDate: format(values.eventDate, "yyyy-MM-dd"),
        eventNames: [values.eventName],
      };
      await axios.post("/api/events", eventData);

      await queryClient.invalidateQueries({
        queryKey: ["events", format(date, "yyyy-MM-dd")],
      });

      await queryClient.invalidateQueries({
        queryKey: ["month-events"],
      });

      toggleCreating();
      form.reset();
      toast.success("event created");
    } catch {
      toast.error("something went wrong");
    }
  }

  return (
    <>
      <div className="mt-4 rounded-2xl border bg-card p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Events
            </h2>
            <p className="text-sm text-muted-foreground">
              {format(date, "PPP")}
            </p>
          </div>

          <Button size="sm" variant="outline" onClick={toggleCreating}>
            {!isCreating ? (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </>
            ) : (
              "Cancel"
            )}
          </Button>
        </div>

        {isCreating && (
          <div className="rounded-xl border bg-muted/30 p-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="eventDate"
                  render={({ field }) => (
                    <FormItem className="sr-only">
                      <FormControl>
                        <span className="inline-flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value && format(field.value, "PPP")}
                        </span>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="eventName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Name</FormLabel>

                      <FormControl>
                        <Input
                          placeholder="Write event name..."
                          {...field}
                          disabled={isSubmitting}
                          ref={inputRef}
                          autoComplete="off"
                          className="bg-background"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button type="submit" disabled={!isValid || isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Event"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>

      <div
        className={cn(
          "px-1 py-4 transition-all duration-200",
          isCreating && "pointer-events-none opacity-50 blur-[1px]",
        )}
      >
        <GetEvents date={date} />
      </div>
    </>
  );
}
