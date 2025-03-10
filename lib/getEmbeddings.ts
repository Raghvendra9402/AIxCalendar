import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export async function getEmbeddings(input: string) {
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY!,
    model: "text-embedding-004",
  });
  const embedding = await embeddings.embedQuery(input);

  return embedding;
}
