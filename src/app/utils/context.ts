import { ScoredPineconeRecord } from "@pinecone-database/pinecone";
import { getMatchesFromEmbeddings } from "./pinecone";
import { getEmbeddings } from "./embeddings";

export type Metadata = {
  content_type: string,
  page_number: number,
  segment_type: string,
  text: string,
}

// The function `getContext` is used to retrieve the context of a given message
export const getContext = async (
  message: string,
  namespace: string,
  maxTokens = 3000,
  minScore = 0.5
): Promise<string | ScoredPineconeRecord[]> => {
  const embedding = await getEmbeddings(message);

  const matches = await getMatchesFromEmbeddings(embedding, 10, namespace);
  console.log("Matches:", matches);

  const qualifyingDocs = matches.filter(m => m.score && m.score > minScore);
  console.log("Qualifying docs:", qualifyingDocs);

  let docs: string[] = [];
  qualifyingDocs.map(match => {
    const metadata = match.metadata as Metadata;
    docs.push(`[Page ${metadata.page_number}]: ${metadata.text}`);
  });

  console.log("Docs:", docs);

  // Join all the chunks of text together, truncate to the maximum number of tokens, and return the result
  return docs.join("\n").substring(0, maxTokens);
}
