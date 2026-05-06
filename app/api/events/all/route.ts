import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const dateRecords = await prisma.dateRecord.findMany({
      where: {
        events: {
          some: {
            userId,
          },
        },
      },
      include: {
        events: {
          where: {
            userId,
          },
        },
      },
    });

    return NextResponse.json(dateRecords);
  } catch (error) {
    return new NextResponse("Invalid server error", { status: 500 });
  }
}
