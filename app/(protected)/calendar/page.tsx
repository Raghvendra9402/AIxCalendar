import { Calendar } from "@/components/shared/calendar";
import { ChatButton } from "@/components/shared/chat-button";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function CalendarPage() {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/error-page");
  }

  return (
    <div className="h-full flex items-center justify-center">
      <Calendar userId={userId} />
    </div>
  );
}
