import { Calendar } from "@/components/shared/calendar";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function CalendarPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/error-page");
  }
  const events = await prisma.dateRecord.findMany({
    where: {
      events: {
        some: {
          userId,
        },
      },
    },
    include: {
      events: true,
    },
  });

  return (
    <div className="h-full flex items-center justify-center">
      <Calendar initialData={events} userId={userId} />
    </div>
  );
}
