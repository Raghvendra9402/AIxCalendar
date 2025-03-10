import { prisma } from "@/lib/db";
import { getEmbeddings } from "@/lib/getEmbeddings";
import { vectorIndex } from "@/lib/pinecone";
import { auth } from "@clerk/nextjs/server";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { LangChainAdapter } from "ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = await auth();
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
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are a friendly and helpful calendar assistant. Your role is to:
          - Warmly greet users who say hello/hi with "Hi there! How can I help you with your calendar today?"
          - Help users find event details from their calendar
          - Respond with event dates when specifically asked
          - Always reference that you are checking their calendar app for accuracy
          - Politely explain when no matching event is found

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

    const google = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      model: "gemini-pro",
    });

    const chain = prompt.pipe(google);
    const response = await chain.stream({
      input: messageTruncated.map((m) => m.content).join("\n"),
      events: relevantEvents
        .map(
          (e) =>
            `Event Date : ${e.dateRecord.date}\n\n EventName: ${e.eventName}`
        )
        .join("\n"),
    });

    return LangChainAdapter.toDataStreamResponse(response);
  } catch (error) {
    console.log("[CHAT_API_ROUTE]", error);
    return new NextResponse("Invalid error", { status: 500 });
  }
}
