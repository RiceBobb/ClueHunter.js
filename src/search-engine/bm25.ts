import { BM25Retriever } from "@langchain/community/retrievers/bm25";
import { Document } from "@langchain/core/documents";

export async function bm25_search(
  query: string,
  contents: Document[],
  passage_limit = contents.length,
  showScore = true
): Promise<Document<Record<string, any>>[]> {
  if (!query || !contents) {
    throw new Error("Query and contents must be provided");
  }

  const retriever = BM25Retriever.fromDocuments(contents, {
    k: passage_limit,
    includeScore: showScore,
  });

  const results = await retriever.invoke(query);

  return results;
}
