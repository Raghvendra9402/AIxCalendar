import { auth } from "@clerk/nextjs/server";
import { prisma } from "./db";
import { getEmbeddings } from "./getEmbeddings";
import { vectorIndex } from "./pinecone";

export async function createEvent({
  eventName,
  eventDate,
}: {
  eventName: string;
  eventDate: Date;
}) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const parsedDate = new Date(eventDate).toDateString();
    const dateAsObject = new Date(parsedDate);
    const textToEmbed = `Event Date : ${parsedDate}\n\n Event Name : ${eventName}`;
    const embedding = await getEmbeddings(textToEmbed);

    const newEvent = await prisma.$transaction(
      async (tx) => {
        const dateRecord = await tx.dateRecord.upsert({
          where: { date: dateAsObject },
          update: {},
          create: { date: dateAsObject },
        });
        console.log("[DATERECORD from outside]", dateRecord);
        const createdEvent = await tx.event.create({
          data: {
            eventName,
            dateId: dateRecord.id,
            userId,
          },
        });

        await vectorIndex.upsert([
          {
            id: createdEvent.id,
            values: embedding,
            metadata: { userId },
          },
        ]);
        return { createdEvent, dateRecord };
      },
      { timeout: 10000 }
    );

    return {
      success: true,
      data: newEvent,
      message: "Event created sucessfully!",
    };
  } catch (error) {
    console.log("[CREATE_EVENT_FUNCTION]", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred.",
    };
  }
}
