import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: {
      eventId: string;
      reminderId: string;
    };
  },
) {
  try {
    const { eventId, reminderId } = await params;
    const { userId } = await auth();

    if (!reminderId || !userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const deletedReminder = await prisma.reminder.deleteMany({
      where: {
        id: reminderId,
        eventId: eventId,
        event: {
          userId: userId,
        },
      },
    });

    return NextResponse.json(deletedReminder);
  } catch (error) {
    console.log("[REMINDER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
