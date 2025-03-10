import { prisma } from "@/lib/db";
import { reminderQueue } from "@/lib/reminderQueue";
import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const eventId = url.searchParams.get("eventId");
    const { userId } = await auth();
    console.log(eventId);

    if (!eventId || !userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    const reminders = await prisma.reminder.findMany({
      where: {
        eventId,
      },
      orderBy: {
        remindAt: "asc",
      },
    });

    return NextResponse.json(reminders);
  } catch (error) {
    console.log("[GET_REMINDERS]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const { eventId } = await params;
    const { date, title, email } = await req.json();
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!date || !title || !email) {
      return new NextResponse("Invalid fields", { status: 400 });
    }
    const reminderDate = new Date(date);
    const delay = reminderDate.getTime() - Date.now();

    if (delay <= 0) {
      return new NextResponse("Reminder Must be in future", { status: 400 });
    }

    const reminder = await prisma.reminder.create({
      data: {
        reminderTitle: title,
        userEmail: email,
        remindAt: date,
        eventId: eventId,
      },
    });

    await reminderQueue.add(
      "send-reminder",
      {
        id: reminder.id,
        title,
        email,
      },
      { delay }
    );
    return NextResponse.json(reminder);
  } catch (error) {
    console.log("[REMINDER_API]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
