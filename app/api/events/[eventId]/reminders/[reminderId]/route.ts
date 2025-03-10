import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { eventId: string; reminderId: string } }
) {
  try {
    const { reminderId, eventId } = await params;
    const { userId } = await auth();

    if (!reminderId || !userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    const deletedReminder = await prisma.reminder.delete({
      where: {
        id: reminderId,
      },
    });

    return NextResponse.json(deletedReminder);
  } catch (error) {
    console.log("[REMINDER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
