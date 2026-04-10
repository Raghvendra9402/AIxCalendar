import { prisma } from "@/lib/db";
import { getEmbeddings } from "@/lib/getEmbeddings";
import { vectorIndex } from "@/lib/pinecone";
import { auth } from "@clerk/nextjs/server";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
convertToCoreMessages,
LangChainAdapter,
LanguageModelV1,
streamText,
} from "ai";
import { NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import { createEvent } from "@/lib/createEvent";
import { format } from "date-fns";
import axios from "axios";
import { tool } from "@langchain/core/tools";

export async function POST(req: Request) {
try {
const body = await req.json();
const { userId } = await auth();
if (!userId) {
return new NextResponse("Unauthorized", { status: 400 });
}
type Message = {
role: "user" | "assistant";
content: string;
};
const messages: Message[] = body.messages;

    const messageTruncated = messages.slice(-6);
    const latestMessage = messages[messages.length - 1]?.content || "";

    const textToEmbed = messageTruncated.map((msg) => msg.content).join("\n");
    const embedding = await getEmbeddings(textToEmbed);

    const vectorQueryResponse = await vectorIndex.query({
      vector: embedding,
      topK: 4,
      filter: { userId },
    });

    const eventId = vectorQueryResponse.matches.map((match) => match.id);
    const relevantEvents = await prisma.event.findMany({
      where: {
        id: { in: eventId },
      },
      include: {
        dateRecord: true,
      },
    });
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are a friendly and helpful calendar assistant. Your role is to:
          - Warmly greet users who say hello/hi with "Hi there! How can I help you with your calendar today?"
          - Help users find event details from their calendar
          - Respond with event dates when specifically asked
          - Always reference that you are checking their calendar app for accuracy
          - Politely explain when no matching event is found
          - Offer to help create new events when appropriate
          - Today's date is ${formattedDate} and time is ${formattedTime}.

          When providing event information:
          - Include both the event name and date
          - Confirm you are pulling this from their calendar
          - Keep responses concise and focused
          - Never invent or assume event details not in the data

          Event database format:
          {events}

          If no event matches the query, respond with: "I've checked your calendar but I'm sorry, I couldn't find that event. Would you like to schedule it?"`,
      ],
      ["user", "{input}"],
    ]);

    console.log("[CHAT_API_ROUTE] Creating event tool");
    const createEventTool = tool(
      async ({ eventName, eventDate }) => {
        console.log("[CHAT_API_ROUTE] Creating event:", eventName, eventDate);
        try {
          const eventTextEmbed = `Event Date: ${eventDate}\n\n Event Name : ${eventName}`;
          const eventEmbedding = await getEmbeddings(eventTextEmbed);
          const parsedDate = new Date(eventDate);
          const dateAsObject = new Date(parsedDate);
          const newEvent = await prisma.$transaction(
            async (tx) => {
              const dateRecord = await tx.dateRecord.upsert({
                where: { date: dateAsObject },
                update: {},
                create: { date: dateAsObject },
              });
              console.log("[DATERECORD from inside]", dateRecord);
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
                  values: eventEmbedding,
                  metadata: { userId },
                },
              ]);
              return { createdEvent, dateRecord };
            },
            { timeout: 10000 },
          );
          console.log("[DEBUG] Event creation result:", newEvent);
          return {
            success: true,
            data: newEvent,
            message: "Event created successfully!",
          };
        } catch (error) {
          console.log("[CREATE_EVENT_FUNCTION]", error);
          return {
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "An unknown error occurred.",
          };
        }
      },
      {
        name: "create_event",
        description: "creating a event for a particular date on a calendar",
        schema: z.object({
          eventName: z.string().describe("Name of the event"),
          eventDate: z.date().describe("Date of the event"),
        }),
      },
    );

    const google = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      model: "gemini-3-flash-preview",
    }).bindTools([createEventTool]);

    const chain = prompt.pipe(google);
    const response = await chain.invoke({
      input: messageTruncated.map((m) => m.content).join("\n"),
      events: relevantEvents
        .map(
          (e) =>
            `Event Date : ${e.dateRecord.date}\n\n EventName: ${e.eventName}`,
        )
        .join("\n"),
    });
    console.log("[CHAT_API_ROUTE] Response streaming started");
    console.log("[Response]", response);
    if (response.tool_calls && response.tool_calls.length > 0) {
      for (const toolCall of response.tool_calls) {
        if (toolCall.name === "create_event") {
          console.log(
            "[DEBUG] Executing create_event tool with args:",
            toolCall.args,
          );

          // Execute the createEvent function with the provided arguments
          const eventResult = await createEvent({
            eventName: toolCall.args.eventName,
            eventDate: new Date(toolCall.args.eventDate),
          });

          console.log("[DEBUG] Event creation result:", eventResult);
          const response = await chain.stream({
            input: messageTruncated.map((m) => m.content).join("\n"),
            events: relevantEvents
              .map(
                (e) =>
                  `Event Date : ${e.dateRecord.date}\n\n EventName: ${e.eventName}`,
              )
              .join("\n"),
            toolResults: [eventResult],
          });

          console.log("[CHAT_API_ROUTE] Response streaming started");
          return LangChainAdapter.toDataStreamResponse(response);
        }
      }
    }

    const finalResponse = await chain.stream({
      input: messageTruncated.map((m) => m.content).join("\n"),
      events: relevantEvents
        .map(
          (e) =>
            `Event Date : ${e.dateRecord.date}\n\n EventName: ${e.eventName}`,
        )
        .join("\n"),
    });

    console.log("[CHAT_API_ROUTE] Response streaming started");
    console.log(finalResponse);

    return LangChainAdapter.toDataStreamResponse(finalResponse);

} catch (error) {
console.log("[CHAT_API_ROUTE]", error);
return new NextResponse("Invalid error", { status: 500 });
}
}
