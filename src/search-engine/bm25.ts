import { BM25Retriever } from "@langchain/community/retrievers/bm25";
import { Document } from "@langchain/core/documents";

function convert_arr_to_doc(split_text_arr: string[]): Document[] {
  return split_text_arr.map((sentence) => ({
    pageContent: sentence,
    metadata: {},
  }));
}

export async function bm25_search(
  query: string,
  contents: string[],
  bm25_top_k: number = contents.length,
  showScore: boolean = true
): Promise<Document<Record<string, any>>[]> {
  if (!query || !contents) {
    throw new Error("Query and contents must be provided");
  }

  const passages = convert_arr_to_doc(contents);

  const retriever = BM25Retriever.fromDocuments(passages, {
    k: bm25_top_k,
    includeScore: showScore,
  });

  const results = await retriever.invoke(query);

  return results;
}
