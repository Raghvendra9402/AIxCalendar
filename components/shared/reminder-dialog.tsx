"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateReminder,
  useDeleteReminder,
  useGetReminders,
} from "@/hooks/useReminders";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Event } from "@prisma/client";
import { format } from "date-fns";
import { Plus, X } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { DeleteDialog } from "./delete-event-dialog";

const formSchema = z.object({
  email: z.string(),
  title: z.string(),
  hour: z.string(),
  minute: z.string(),
});

interface ReminderDialogProps {
  children: React.ReactNode;
  date: Date;
  eventName: string;
  initialData: Event;
}

export function ReminderDialog({
  children,
  date,
  eventName,
  initialData,
}: ReminderDialogProps) {
  const { data: reminders = [] } = useGetReminders(initialData.id);
  const createReminder = useCreateReminder(initialData.id);
  const deleteReminder = useDeleteReminder(initialData.id);
  const [isCreating, setIsCreating] = useState(false);

  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  if (!userEmail) {
    toast.error("email not found");
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: userEmail,
      title: eventName ?? "New Reminder",
      hour: "12",
      minute: "00",
    },
  });

  const toggleCreating = () => {
    setIsCreating(!isCreating);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    date.setHours(Number(values.hour));
    date.setMinutes(Number(values.minute));
    const payload = { date, title: values.title, email: userEmail! };
    createReminder.mutate(payload, {
      onSuccess: () => {
        toggleCreating();
        form.reset();
      },
    });
  };

  const handleDelete = (reminderId: string) => {
    deleteReminder.mutate(reminderId);
  };

  const showDate = format(date, "PPP");

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent className="max-w-[550px] border bg-background">
          <DialogHeader className="my-4 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle className="text-xl font-semibold tracking-tight text-foreground">
                  Set Reminder
                </DialogTitle>

                <p className="mt-1 text-sm text-muted-foreground">
                  For{" "}
                  <span className="font-semibold text-primary">{showDate}</span>
                </p>
              </div>

              {isCreating ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleCreating}
                  className="text-muted-foreground"
                >
                  Cancel
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={toggleCreating}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              )}
            </div>

            <DialogDescription className="text-sm text-muted-foreground">
              {isCreating
                ? "Choose a future time for your reminder."
                : "Manage your reminders"}
            </DialogDescription>
          </DialogHeader>

          {isCreating && (
            <div className="rounded-xl border bg-muted/30 p-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registered Email</FormLabel>

                          <FormControl>
                            <Input
                              disabled
                              {...field}
                              className="bg-background"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reminder Title</FormLabel>

                          <FormControl>
                            <Input
                              disabled
                              {...field}
                              className="bg-background"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="hour"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Hour</FormLabel>

                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Hour" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                              {Array.from({ length: 24 }, (_, i) => (
                                <SelectItem
                                  key={i}
                                  value={i.toString().padStart(2, "0")}
                                >
                                  {i.toString().padStart(2, "0")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="minute"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Minute</FormLabel>

                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Minute" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                              {Array.from({ length: 60 }, (_, i) => (
                                <SelectItem
                                  key={i}
                                  value={i.toString().padStart(2, "0")}
                                >
                                  {i.toString().padStart(2, "0")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createReminder.isPending}
                  >
                    Add Reminder
                  </Button>
                </form>
              </Form>
            </div>
          )}

          {!isCreating && reminders.length === 0 && (
            <div className="flex items-center justify-center rounded-xl border border-dashed py-10">
              <p className="text-sm italic text-muted-foreground">
                No reminders yet...
              </p>
            </div>
          )}

          {!isCreating && reminders.length > 0 && (
            <div className="space-y-3">
              {reminders.map((reminder) => (
                <Card
                  key={reminder.id}
                  className="border bg-card transition-all hover:shadow-md"
                >
                  <CardContent className="flex items-start justify-between gap-4 p-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="truncate text-sm font-semibold text-foreground">
                          {reminder.reminderTitle}
                        </h1>

                        <Badge
                          className={cn(
                            "font-medium",
                            reminder.reminderStatus
                              ? "bg-emerald-500 hover:bg-emerald-500"
                              : "bg-destructive hover:bg-destructive",
                          )}
                        >
                          {reminder.reminderStatus ? "Pending" : "Expired"}
                        </Badge>
                      </div>

                      <p className="mt-2 text-xs text-muted-foreground">
                        {format(reminder.remindAt, "PPP p")}
                      </p>
                    </div>

                    <DeleteDialog
                      onClick={() => handleDelete(reminder.id)}
                      disabled={deleteReminder.isPending}
                    >
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </DeleteDialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
