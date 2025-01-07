const { BM25Retriever } = require("@langchain/community/retrievers/bm25");

export async function bm25_search(query: string, contents: string[]) {
  const retriever = BM25Retriever.fromDocuments(
    contents,
    { includeScore: true }
  );

  const results = await retriever.invoke(query);
  console.log(results);

  return results;
}
